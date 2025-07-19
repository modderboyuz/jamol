// Environment configuration for different deployment environments
export const config = {
  // Backend API URL - will be different for Vercel deployment
  apiUrl: process.env.NODE_ENV === 'production' 
    ? (import.meta.env.VITE_API_URL || 'https://your-backend.vercel.app')
    : 'http://localhost:5000',
  
  // Supabase configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://hcgvmcwcdfdilyahzsqo.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjZ3ZtY3djZGZkaWx5YWh6c3FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NDc3NTMsImV4cCI6MjA2ODMyMzc1M30.Vofrm1hoAHNxhOSKVZVaRv9KEECkXAT-dQph9jGvb1U'
  },
  
  // Telegram bot configuration
  telegram: {
    botUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'jamolstroybot'
  }
};