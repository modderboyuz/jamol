import { supabase } from './db';
import type { 
  User, 
  InsertUser, 
  Category, 
  InsertCategory,
  Product, 
  InsertProduct,
  Order, 
  InsertOrder,
  OrderItem, 
  InsertOrderItem,
  Ad, 
  InsertAd,
  CartItem,
  CompanySettings,
  InsertCompanySettings,
  WorkerApplication,
  InsertWorkerApplication,
  WorkerReview,
  InsertWorkerReview,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByTelegramId(telegramId: number | undefined): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  updateUserSwitchedTo(id: string, switchedTo: 'client' | 'admin' | null): Promise<User>;
  getWorkers(search?: string): Promise<User[]>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getSubcategories(parentId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  
  // Products
  getProducts(categoryId?: string, search?: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  
  // Orders
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order>;
  
  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Cart
  getCartItems(userId: string): Promise<(CartItem & { product: Product })[]>;
  addToCart(userId: string, productId: string, quantity: number): Promise<CartItem>;
  updateCartItem(userId: string, productId: string, quantity: number): Promise<CartItem>;
  removeFromCart(userId: string, productId: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  // Ads
  getActiveAds(): Promise<Ad[]>;
  getAds(): Promise<Ad[]>;
  createAd(ad: InsertAd): Promise<Ad>;
  updateAd(id: string, ad: Partial<InsertAd>): Promise<Ad>;
  deleteAd(id: string): Promise<void>;
  
  // Company Settings
  getCompanySettings(): Promise<CompanySettings | undefined>;
  updateCompanySettings(settings: Partial<InsertCompanySettings>): Promise<CompanySettings>;
  
  // Worker Applications
  getWorkerApplications(workerId: string): Promise<WorkerApplication[]>;
  getClientApplications(clientId: string): Promise<WorkerApplication[]>;
  createWorkerApplication(application: InsertWorkerApplication): Promise<WorkerApplication>;
  updateWorkerApplication(id: string, application: Partial<InsertWorkerApplication>): Promise<WorkerApplication>;
  deleteWorkerApplication(id: string): Promise<void>;
  
  // Worker Reviews
  getWorkerReviews(workerId: string): Promise<WorkerReview[]>;
  createWorkerReview(review: InsertWorkerReview): Promise<WorkerReview>;
}

export class SupabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
    return data;
  }

  async getUserByTelegramId(telegramId: number | undefined): Promise<User | undefined> {
    if (!telegramId) return undefined;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();
    
    if (error) {
      console.error('Error fetching user by telegram ID:', error);
      return undefined;
    }
    return data;
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();
    
    if (error) {
      console.error('Error fetching user by phone:', error);
      return undefined;
    }
    return data;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }
    return data;
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(user)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
    return data;
  }

  async updateUserSwitchedTo(id: string, switchedTo: 'client' | 'admin' | null): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({ switched_to: switchedTo })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user switched_to:', error);
      throw error;
    }
    return data;
  }

  async getWorkers(search?: string): Promise<User[]> {
    try {
      let query = supabase
        .from('users')
        .select('*')
        .eq('role', 'worker')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,telegram_username.ilike.%${search}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error getting workers:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error getting workers:', error);
      return [];
    }
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .is('parent_id', null)
      .order('order_index');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
    return data || [];
  }

  async getSubcategories(parentId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .eq('parent_id', parentId)
      .order('order_index');
    
    if (error) {
      console.error('Error fetching subcategories:', error);
      return [];
    }
    return data || [];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }
    return data;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }
    return data;
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // Products
  async getProducts(categoryId?: string, search?: string): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_available', true);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (search) {
      query = query.or(`name_uz.ilike.%${search}%,name_ru.ilike.%${search}%,description_uz.ilike.%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }
    return data || [];
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      return undefined;
    }
    return data;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    return data;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }
    return data;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Orders
  async getOrders(userId?: string): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select('*');

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
    return data || [];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching order:', error);
      return undefined;
    }
    return data;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    return data;
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order> {
    const { data, error } = await supabase
      .from('orders')
      .update(order)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating order:', error);
      throw error;
    }
    return data;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);
    
    if (error) {
      console.error('Error fetching order items:', error);
      return [];
    }
    return data || [];
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const { data, error } = await supabase
      .from('order_items')
      .insert(orderItem)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order item:', error);
      throw error;
    }
    return data;
  }

  // Cart
  async getCartItems(userId: string): Promise<(CartItem & { product: Product })[]> {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
    return data || [];
  }

  async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('user_id', userId)
        .eq('product_id', productId)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating cart item:', error);
        throw error;
      }
      return data;
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id: productId, quantity })
        .select()
        .single();
      
      if (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
      return data;
    }
  }

  async updateCartItem(userId: string, productId: string, quantity: number): Promise<CartItem> {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
    return data;
  }

  async removeFromCart(userId: string, productId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    
    if (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async clearCart(userId: string): Promise<void> {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  // Ads
  async getActiveAds(): Promise<Ad[]> {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching active ads:', error);
      return [];
    }
    return data || [];
  }

  async getAds(): Promise<Ad[]> {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching ads:', error);
      return [];
    }
    return data || [];
  }

  async createAd(ad: InsertAd): Promise<Ad> {
    const { data, error } = await supabase
      .from('ads')
      .insert(ad)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating ad:', error);
      throw error;
    }
    return data;
  }

  async updateAd(id: string, ad: Partial<InsertAd>): Promise<Ad> {
    const { data, error } = await supabase
      .from('ads')
      .update(ad)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating ad:', error);
      throw error;
    }
    return data;
  }

  async deleteAd(id: string): Promise<void> {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting ad:', error);
      throw error;
    }
  }

  // Company Settings
  async getCompanySettings(): Promise<CompanySettings | undefined> {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error fetching company settings:', error);
      return undefined;
    }
    return data;
  }

  async updateCompanySettings(settings: Partial<InsertCompanySettings>): Promise<CompanySettings> {
    const existing = await this.getCompanySettings();
    
    if (existing) {
      const { data, error } = await supabase
        .from('company_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating company settings:', error);
        throw error;
      }
      return data;
    } else {
      const { data, error } = await supabase
        .from('company_settings')
        .insert(settings)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating company settings:', error);
        throw error;
      }
      return data;
    }
  }

  // Worker Applications
  async getWorkerApplications(workerId: string): Promise<WorkerApplication[]> {
    try {
      const { data, error } = await supabase
        .from('worker_applications')
        .select(`
          *,
          client:users!client_id(id, first_name, last_name, phone)
        `)
        .eq('worker_id', workerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error getting worker applications:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error getting worker applications:', error);
      return [];
    }
  }

  async getClientApplications(clientId: string): Promise<WorkerApplication[]> {
    const { data, error } = await supabase
      .from('worker_applications')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching client applications:', error);
      return [];
    }
    return data || [];
  }

  async createWorkerApplication(application: InsertWorkerApplication): Promise<WorkerApplication> {
    const { data, error } = await supabase
      .from('worker_applications')
      .insert(application)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating worker application:', error);
      throw error;
    }
    return data;
  }

  async updateWorkerApplication(id: string, application: Partial<InsertWorkerApplication>): Promise<WorkerApplication> {
    const { data, error } = await supabase
      .from('worker_applications')
      .update(application)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating worker application:', error);
      throw error;
    }
    return data;
  }

  async deleteWorkerApplication(id: string): Promise<void> {
    const { error } = await supabase
      .from('worker_applications')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting worker application:', error);
      throw error;
    }
  }

  // Worker Reviews
  async getWorkerReviews(workerId: string): Promise<WorkerReview[]> {
    const { data, error } = await supabase
      .from('worker_reviews')
      .select(`
        *,
        client:users!client_id(id, first_name, last_name)
      `)
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching worker reviews:', error);
      return [];
    }
    return data || [];
  }

  async createWorkerReview(review: InsertWorkerReview): Promise<WorkerReview> {
    const { data, error } = await supabase
      .from('worker_reviews')
      .insert(review)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating worker review:', error);
      throw error;
    }
    return data;
  }
}

export const storage = new SupabaseStorage();