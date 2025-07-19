import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const search = searchParams.get('search');

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
    
    if (error) throw error;
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Mahsulotlarni olishda xatolik' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Mahsulot yaratishda xatolik' }, { status: 400 });
  }
}