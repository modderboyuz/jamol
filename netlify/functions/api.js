
const express = require('express');
const serverless = require('serverless-http');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-telegram-id');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  const telegramId = req.headers['x-telegram-id'];
  if (!telegramId) {
    return res.status(401).json({ error: "Avtorizatsiya talab qilinadi" });
  }
  req.telegramId = telegramId;
  next();
};

// Categories routes
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .is('parent_id', null)
      .order('order_index');
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: "Kategoriyalarni olishda xatolik" });
  }
});

app.get('/api/categories/:parentId/subcategories', async (req, res) => {
  try {
    const { parentId } = req.params;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', parentId)
      .order('order_index');
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: "Subkategoriyalarni olishda xatolik" });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const { category_id, search } = req.query;
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(name_uz, name_ru)
      `)
      .eq('is_active', true);

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (search) {
      query = query.or(`name_uz.ilike.%${search}%,name_ru.ilike.%${search}%,description_uz.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: "Mahsulotlarni olishda xatolik" });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(name_uz, name_ru)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: "Mahsulot topilmadi" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Mahsulotni olishda xatolik" });
  }
});

// Auth routes
app.post('/api/auth/telegram', async (req, res) => {
  try {
    const { telegram_id } = req.body;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegram_id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }

    res.json({ user: data });
  } catch (error) {
    res.status(500).json({ error: "Server xatoligi" });
  }
});

// Cart routes
app.get('/api/cart', requireAuth, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', req.telegramId)
      .single();
    
    if (!user) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id);
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: "Savatni olishda xatolik" });
  }
});

app.post('/api/cart', requireAuth, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', req.telegramId)
      .single();
    
    if (!user) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }

    const { productId, quantity } = req.body;
    
    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    } else {
      // Create new cart item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity
        })
        .select()
        .single();
      
      if (error) throw error;
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ error: "Savatga qo'shishda xatolik" });
  }
});

// Orders routes
app.get('/api/orders', requireAuth, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('telegram_id', req.telegramId)
      .single();
    
    if (!user) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(*, product:products(name_uz))
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: "Buyurtmalarni olishda xatolik" });
  }
});

// Workers routes
app.get('/api/workers', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        reviews:worker_reviews(rating, comment, created_at)
      `)
      .eq('role', 'worker')
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const workersWithStats = data?.map(worker => {
      const reviews = worker.reviews || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      return {
        id: worker.id,
        first_name: worker.first_name,
        last_name: worker.last_name,
        telegram_username: worker.telegram_username,
        role: worker.role,
        specialization: worker.specialization,
        experience_years: worker.experience_years,
        hourly_rate: worker.hourly_rate,
        description: worker.description,
        is_available: worker.is_available,
        phone: worker.phone,
        created_at: worker.created_at,
        totalReviews,
        averageRating,
        reviews: reviews
      };
    }) || [];

    res.json(workersWithStats);
  } catch (error) {
    res.status(500).json({ error: "Ustalarni olishda xatolik" });
  }
});

// Ads routes
app.get('/api/ads', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: "Reklamalarni olishda xatolik" });
  }
});

// Company settings
app.get('/api/company-settings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    res.json(data || { is_delivery: false });
  } catch (error) {
    res.status(500).json({ error: "Kompaniya sozlamalarini olishda xatolik" });
  }
});

// Export the serverless function
module.exports.handler = serverless(app);
