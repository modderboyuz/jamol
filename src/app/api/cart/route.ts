import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function getUserByTelegramId(telegramId: number) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single();
  
  if (error) return null;
  return data;
}

export async function GET(request: NextRequest) {
  try {
    const telegramId = request.headers.get('x-telegram-id');
    if (!telegramId) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    const user = await getUserByTelegramId(Number(telegramId));
    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error getting cart items:', error);
    return NextResponse.json({ error: 'Savatni olishda xatolik' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const telegramId = request.headers.get('x-telegram-id');
    if (!telegramId) {
      return NextResponse.json({ error: 'Avtorizatsiya talab qilinadi' }, { status: 401 });
    }

    const user = await getUserByTelegramId(Number(telegramId));
    if (!user) {
      return NextResponse.json({ error: 'Foydalanuvchi topilmadi' }, { status: 404 });
    }

    const { productId, quantity } = await request.json();
    
    if (!productId || !quantity) {
      return NextResponse.json({ error: 'Product ID va miqdor majburiy' }, { status: 400 });
    }

    // Check if item already exists
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single();

    if (existing) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .select()
        .single();
      
      if (error) throw error;
      return NextResponse.json(data);
    } else {
      // Insert new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_id: productId, quantity })
        .select()
        .single();
      
      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Savatga qo\'shishda xatolik' }, { status: 500 });
  }
}