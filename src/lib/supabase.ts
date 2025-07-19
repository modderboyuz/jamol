import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hcgvmcwcdfdilyahzsqo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZ3ZtY3djZGZkaWx5YWh6c3FvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0Nzc1MywiZXhwIjoyMDY4MzIzNzUzfQ.4Be30fbPpPkwT98GqTT6I4-b7XaqSw4mnqQHGSciCN8';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Client-side Supabase client
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZ3ZtY3djZGZkaWx5YWh6c3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NDc3NTMsImV4cCI6MjA2ODMyMzc1M30.Vofrm1hoAHNxhOSKVZVaRv9KEECkXAT-dQph9jGvb1U';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthUser {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  telegram_username?: string;
  telegram_id?: number;
  role: 'client' | 'worker' | 'admin';
  type: 'telegram' | 'google';
  created_at: string;
  updated_at: string;
}