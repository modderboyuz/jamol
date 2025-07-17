import { z } from "zod";

// Work types
export interface WorkType {
  id: string;
  name_uz: string;
  name_ru: string;
  description?: string;
  created_at: string;
}

// Users
export interface User {
  id: string;
  phone: string;
  first_name: string;
  last_name: string;
  telegram_username?: string;
  telegram_id?: number;
  role: 'client' | 'worker' | 'admin';
  type: 'telegram' | 'google';
  switched_to?: 'client' | 'admin';
  birth_date?: string;
  passport?: string;
  passport_image?: string;
  profile_image?: string;
  work_type?: string;
  description?: string;
  average_pay?: number;
  address?: string;
  delivery_address?: string;
  delivery_latitude?: string;
  delivery_longitude?: string;
  email?: string;
  passport_series?: string;
  passport_number?: string;
  passport_issued_by?: string;
  passport_issued_date?: string;
  specialization?: string;
  experience_years?: number;
  hourly_rate?: string;
  created_at: string;
  updated_at: string;
}

// Categories
export interface Category {
  id: string;
  name_uz: string;
  name_ru?: string;
  icon?: string;
  order_index?: number;
  is_active?: boolean;
  created_at: string;
}

// Products
export interface Product {
  id: string;
  name_uz: string;
  name_ru?: string;
  description_uz?: string;
  description_ru?: string;
  price: string;
  category_id?: string;
  image_url?: string;
  is_available?: boolean;
  is_rental?: boolean;
  unit?: string;
  delivery_price?: string;
  free_delivery_threshold?: string;
  created_at: string;
  updated_at: string;
}

// Orders
export interface Order {
  id: string;
  user_id?: string;
  total_amount: string;
  delivery_amount?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  delivery_address?: string;
  delivery_latitude?: string;
  delivery_longitude?: string;
  delivery_date?: string;
  notes?: string;
  is_delivery?: boolean;
  created_at: string;
  updated_at: string;
}

// Order items
export interface OrderItem {
  id: string;
  order_id?: string;
  product_id?: string;
  quantity: number;
  price_per_unit: string;
  total_price: string;
  created_at: string;
}

// Ads
export interface Ad {
  id: string;
  title_uz: string;
  title_ru?: string;
  description_uz?: string;
  description_ru?: string;
  image_url?: string;
  link_url?: string;
  is_active?: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
}

// Cart items
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

// Company settings
export interface CompanySettings {
  id: string;
  is_delivery: boolean;
  company_name: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  created_at: string;
  updated_at: string;
}

// Worker applications
export interface WorkerApplication {
  id: string;
  client_id: string;
  worker_id: string;
  title: string;
  description: string;
  location?: string;
  location_latitude?: string;
  location_longitude?: string;
  budget?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  urgency: 'low' | 'medium' | 'high';
  contact_phone?: string;
  preferred_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Insert schemas with Zod validation
export const insertUserSchema = z.object({
  phone: z.string().min(1),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  telegram_username: z.string().optional(),
  telegram_id: z.number().optional(),
  role: z.enum(['client', 'worker', 'admin']).default('client'),
  type: z.enum(['telegram', 'google']).default('telegram'),
  switched_to: z.enum(['client', 'admin']).optional(),
  birth_date: z.string().optional(),
  passport: z.string().optional(),
  passport_image: z.string().optional(),
  profile_image: z.string().optional(),
  work_type: z.string().optional(),
  description: z.string().optional(),
  average_pay: z.number().optional(),
  address: z.string().optional(),
  delivery_address: z.string().optional(),
  delivery_latitude: z.string().optional(),
  delivery_longitude: z.string().optional(),
  email: z.string().optional(),
  passport_series: z.string().optional(),
  passport_number: z.string().optional(),
  passport_issued_by: z.string().optional(),
  passport_issued_date: z.string().optional(),
  specialization: z.string().optional(),
  experience_years: z.number().optional(),
  hourly_rate: z.string().optional(),
});

export const insertCategorySchema = z.object({
  name_uz: z.string().min(1),
  name_ru: z.string().optional(),
  icon: z.string().optional(),
  order_index: z.number().default(0),
  is_active: z.boolean().default(true),
});

export const insertProductSchema = z.object({
  name_uz: z.string().min(1),
  name_ru: z.string().optional(),
  description_uz: z.string().optional(),
  description_ru: z.string().optional(),
  price: z.string(),
  category_id: z.string().optional(),
  image_url: z.string().optional(),
  is_available: z.boolean().default(true),
  is_rental: z.boolean().default(false),
  unit: z.string().default('dona'),
  delivery_price: z.string().default('0'),
  free_delivery_threshold: z.string().default('0'),
});

export const insertOrderSchema = z.object({
  user_id: z.string().optional(),
  total_amount: z.string(),
  delivery_amount: z.string().default('0'),
  status: z.enum(['pending', 'confirmed', 'processing', 'completed', 'cancelled']).default('pending'),
  delivery_address: z.string().optional(),
  delivery_latitude: z.string().optional(),
  delivery_longitude: z.string().optional(),
  delivery_date: z.string().optional(),
  notes: z.string().optional(),
  is_delivery: z.boolean().default(false),
});

export const insertOrderItemSchema = z.object({
  order_id: z.string().optional(),
  product_id: z.string().optional(),
  quantity: z.number().default(1),
  price_per_unit: z.string(),
  total_price: z.string(),
});

export const insertAdSchema = z.object({
  title_uz: z.string().min(1),
  title_ru: z.string().optional(),
  description_uz: z.string().optional(),
  description_ru: z.string().optional(),
  image_url: z.string().optional(),
  link_url: z.string().optional(),
  is_active: z.boolean().default(true),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export const insertWorkTypeSchema = z.object({
  name_uz: z.string().min(1),
  name_ru: z.string().min(1),
  description: z.string().optional(),
});

export const insertCartItemSchema = z.object({
  user_id: z.string(),
  product_id: z.string(),
  quantity: z.number().default(1),
});

export const insertCompanySettingsSchema = z.object({
  is_delivery: z.boolean().default(false),
  company_name: z.string().default('MetalBaza'),
  company_address: z.string().optional(),
  company_phone: z.string().optional(),
  company_email: z.string().optional(),
});

export const insertWorkerApplicationSchema = z.object({
  client_id: z.string(),
  worker_id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  location: z.string().optional(),
  location_latitude: z.string().optional(),
  location_longitude: z.string().optional(),
  budget: z.string().optional(),
  status: z.enum(['pending', 'accepted', 'rejected', 'completed', 'cancelled']).default('pending'),
  urgency: z.enum(['low', 'medium', 'high']).default('medium'),
  contact_phone: z.string().optional(),
  preferred_date: z.string().optional(),
  notes: z.string().optional(),
});

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertAd = z.infer<typeof insertAdSchema>;
export type InsertWorkType = z.infer<typeof insertWorkTypeSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertCompanySettings = z.infer<typeof insertCompanySettingsSchema>;
export type InsertWorkerApplication = z.infer<typeof insertWorkerApplicationSchema>;
