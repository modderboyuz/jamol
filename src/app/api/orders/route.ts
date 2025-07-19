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
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error getting orders:', error);
    return NextResponse.json({ error: 'Buyurtmalarni olishda xatolik' }, { status: 500 });
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

    const orderData = await request.json();

    // Get cart items to create order
    const { data: cartItems } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id);

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Buyurtmada mahsulotlar bo\'lishi kerak' }, { status: 400 });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        user_id: user.id,
        total_amount: totalAmount,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    for (const item of cartItems) {
      await supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_per_unit: item.product.price,
          total_price: Number(item.product.price) * item.quantity,
        });
    }

    // Clear cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Buyurtma berishda xatolik' }, { status: 400 });
  }
}