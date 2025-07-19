import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('company_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      // Return default settings if none exist
      return NextResponse.json({ is_delivery: false });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error getting company settings:', error);
    return NextResponse.json({ error: 'Kompaniya sozlamalarini olishda xatolik' }, { status: 500 });
  }
}