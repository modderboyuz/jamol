import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        reviews:worker_reviews(rating, comment, created_at)
      `)
      .eq('role', 'worker')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate average rating and total reviews for each worker
    const workersWithStats = data?.map(worker => {
      const reviews = worker.reviews || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / totalReviews 
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
        phone: worker.phone,
        created_at: worker.created_at,
        totalReviews,
        averageRating,
        reviews: reviews
      };
    }) || [];

    return NextResponse.json(workersWithStats);
  } catch (error) {
    console.error("Workers API error:", error);
    return NextResponse.json({ error: "Ustalarni olishda xatolik" }, { status: 500 });
  }
}