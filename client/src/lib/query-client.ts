import { QueryClient } from '@tanstack/react-query';
import { config } from './config';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0];
        const res = await fetch(url as string);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${url}: ${res.status}`);
        }
        return res.json();
      },
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});

export async function apiRequest(url: string, options: RequestInit = {}) {
  // Use full URL for production, relative for development
  const fullUrl = url.startsWith('http') ? url : `${config.apiUrl}${url}`;
  
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json();
}
  