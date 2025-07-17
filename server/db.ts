import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://hcgvmcwcdfdilyahzsqo.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZ3ZtY3djZGZkaWx5YWh6c3FvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjc0Nzc1MywiZXhwIjoyMDY4MzIzNzUzfQ.4Be30fbPpPkwT98GqTT6I4-b7XaqSw4mnqQHGSciCN8';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log('✅ Supabase client initialized successfully');

// Test connection
supabase.auth.getSession().then(() => {
  console.log('✅ Supabase connection tested successfully');
}).catch((error) => {
  console.error('❌ Supabase connection test failed:', error);
});
