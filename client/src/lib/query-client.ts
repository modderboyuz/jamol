import { QueryClient } from '@tanstack/react-query';
import { config } from './config';
        const res = await fetch(url as string);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${url}: ${res.status}`);
        }
        return res.json();
      },
    headers: {
      retry: 1,
      "Content-Type": "application/json",
});
      ...options.headers,

    },
export async function apiRequest(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }

  return res.json();
        const fullUrl = url.startsWith('http') ? url : `${config.apiUrl}${url}`;
}
        
  options: RequestInit = {},
  // Use full URL for production, relative for development
  const fullUrl = url.startsWith('http') ? url : `${config.apiUrl}${url}`;
  