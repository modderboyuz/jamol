-- METALBAZA TIZIMI UCHUN SQL KODLAR
-- Bu kodlarni Supabase SQL Editor yoki psql orqali ishga tushiring

-- 1. CATEGORIES JADVALIGA PARENT_ID USTUNI QO'SHISH (SUBCATEGORIES UCHUN)
ALTER TABLE categories 
ADD COLUMN parent_id UUID REFERENCES categories(id);

-- 2. WORKER REVIEWS JADVALI YARATISH
CREATE TABLE worker_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. WORKER REVIEWS UCHUN INDEXES
CREATE INDEX idx_worker_reviews_worker_id ON worker_reviews(worker_id);
CREATE INDEX idx_worker_reviews_client_id ON worker_reviews(client_id);
CREATE INDEX idx_worker_reviews_created_at ON worker_reviews(created_at DESC);

-- 4. ORDERS JADVALIGA QO'SHIMCHA USTUNLAR
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS customer_name TEXT,
ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- 5. CATEGORIES UCHUN INDEXES
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_order_index ON categories(order_index);

-- 6. SAMPLE SUBCATEGORIES QO'SHISH
-- Avval asosiy kategoriyani qo'shamiz (agar yo'q bo'lsa)
INSERT INTO categories (name_uz, name_ru, icon, order_index, is_active) 
VALUES 
  ('Asbob-uskunalar', 'Инструменты', 'wrench', 1, true),
  ('Qurilish materiallari', 'Строительные материалы', 'building', 2, true),
  ('Elektr jihozlari', 'Электрооборудование', 'zap', 3, true)
ON CONFLICT DO NOTHING;

-- Subcategoriyalarni qo'shish
INSERT INTO categories (name_uz, name_ru, icon, parent_id, order_index, is_active) 
SELECT 
  'Bolg''a', 'Молоток', 'wrench', c.id, 1, true
FROM categories c 
WHERE c.name_uz = 'Asbob-uskunalar' AND c.parent_id IS NULL
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO categories (name_uz, name_ru, icon, parent_id, order_index, is_active) 
SELECT 
  'Arra', 'Пила', 'wrench', c.id, 2, true
FROM categories c 
WHERE c.name_uz = 'Asbob-uskunalar' AND c.parent_id IS NULL
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO categories (name_uz, name_ru, icon, parent_id, order_index, is_active) 
SELECT 
  'Burgul''ash mashinalari', 'Дрели', 'wrench', c.id, 3, true
FROM categories c 
WHERE c.name_uz = 'Asbob-uskunalar' AND c.parent_id IS NULL
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO categories (name_uz, name_ru, icon, parent_id, order_index, is_active) 
SELECT 
  'O''lchash asboblari', 'Измерительные инструменты', 'wrench', c.id, 4, true
FROM categories c 
WHERE c.name_uz = 'Asbob-uskunalar' AND c.parent_id IS NULL
LIMIT 1
ON CONFLICT DO NOTHING;

-- Qurilish materiallari uchun subcategoriyalar
INSERT INTO categories (name_uz, name_ru, icon, parent_id, order_index, is_active) 
SELECT 
  'G''isht', 'Кирпич', 'building', c.id, 1, true
FROM categories c 
WHERE c.name_uz = 'Qurilish materiallari' AND c.parent_id IS NULL
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO categories (name_uz, name_ru, icon, parent_id, order_index, is_active) 
SELECT 
  'Sement', 'Цемент', 'building', c.id, 2, true
FROM categories c 
WHERE c.name_uz = 'Qurilish materiallari' AND c.parent_id IS NULL
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO categories (name_uz, name_ru, icon, parent_id, order_index, is_active) 
SELECT 
  'Metall konstruksiyalar', 'Металлоконструкции', 'building', c.id, 3, true
FROM categories c 
WHERE c.name_uz = 'Qurilish materiallari' AND c.parent_id IS NULL
LIMIT 1
ON CONFLICT DO NOTHING;

-- 7. ADMIN SESSIONS JADVALI (WEB ADMIN LOGIN UCHUN)
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. TEMPORARY LOGIN TOKENS JADVALI (TELEGRAM WEB LOGIN UCHUN)
CREATE TABLE IF NOT EXISTS temp_login_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  telegram_id BIGINT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 9. ORDER ITEMS UCHUN QO'SHIMCHA USTUNLAR (AGAR KERAK BO'LSA)
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS product_unit TEXT;

-- 10. PERFORMANCE UCHUN INDEXES
CREATE INDEX IF NOT EXISTS idx_temp_login_tokens_token ON temp_login_tokens(token);
CREATE INDEX IF NOT EXISTS idx_temp_login_tokens_telegram_id ON temp_login_tokens(telegram_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_id ON admin_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON products(is_available);

-- 11. CLEANUP FUNCTION (MUDDATI O'TGAN TOKENLARNI TOZALASH)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens() RETURNS void AS $$
BEGIN
  DELETE FROM temp_login_tokens WHERE expires_at < NOW();
  DELETE FROM admin_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 12. WORKER APPLICATIONS STATUSINI YANGILASH UCHUN TRIGGER
CREATE OR REPLACE FUNCTION update_worker_application_status() 
RETURNS TRIGGER AS $$
BEGIN
  -- Agar status 'accepted' ga o'zgarsa, notification yuborish mumkin
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    -- Bu yerda notification logic qo'shish mumkin
    NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 13. SAMPLE WORKER DATA (TEST UCHUN)
INSERT INTO users (phone, first_name, last_name, role, telegram_username, specialization, experience_years, hourly_rate, description)
VALUES 
  ('+998901234567', 'Bekzod', 'Aliyev', 'worker', 'bekzod_builder', 'Qurilishchi', 5, '50000', 'Tajribali qurilishchi, barcha turdagi qurilish ishlarini bajaraman'),
  ('+998902345678', 'Sardor', 'Karimov', 'worker', 'sardor_electric', 'Elektrchi', 8, '60000', 'Malakali elektrchi, elektr montaj ishlari'),
  ('+998903456789', 'Otabek', 'Rakhimov', 'worker', 'otabek_plumber', 'Santexnik', 6, '55000', 'Santexnik, suv va kanalizatsiya tizimlarini o''rnatish')
ON CONFLICT (phone) DO NOTHING;

-- 14. SAMPLE WORKER REVIEWS
INSERT INTO worker_reviews (worker_id, client_id, rating, comment)
SELECT 
  w.id,
  c.id,
  5,
  'Ajoyib ish bajaradi, vaqtida tugatadi'
FROM users w
CROSS JOIN users c
WHERE w.role = 'worker' AND c.role = 'client'
LIMIT 3
ON CONFLICT DO NOTHING;