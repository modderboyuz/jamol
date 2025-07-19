import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { telegram_id } = await request.json();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegram_id)
      .single();
    
    if (error || !data) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: "Server xatoligi" }, { status: 500 });
  }
}