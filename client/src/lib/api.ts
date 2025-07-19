
const API_BASE_URL = import.meta.env.DEV 
  ? 'http://localhost:5000'
  : '/.netlify/functions';

export const api = {
  get: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'x-telegram-id': localStorage.getItem('telegram_id') || '',
      },
    });
    return response.json();
  },
  
  post: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-id': localStorage.getItem('telegram_id') || '',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  put: async (endpoint: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-telegram-id': localStorage.getItem('telegram_id') || '',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },
  
  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'x-telegram-id': localStorage.getItem('telegram_id') || '',
      },
    });
    return response.json();
  }
};
