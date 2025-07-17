import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hliixatnpxjkhkyoswcw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AuthUser {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  telegram_username?: string;
  telegram_id?: number;
  role: 'client' | 'worker' | 'admin';
  type: 'telegram' | 'google';
}

export const authService = {
  async loginWithTelegram(telegramId: number): Promise<AuthUser | null> {
    try {
      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegram_id: telegramId }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Telegram login error:', error);
      return null;
    }
  },

  async getCurrentUser(): Promise<AuthUser | null> {
    const telegramId = localStorage.getItem('telegram_id');
    if (!telegramId) return null;

    return await this.loginWithTelegram(Number(telegramId));
  },

  logout() {
    localStorage.removeItem('telegram_id');
  },
};
