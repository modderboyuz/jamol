# MetalBaza - Next.js Platform

Telegram bot integratsiyali metalbaza uchun Next.js da qurilgan to'liq xizmat platformasi.

## Texnologiyalar

- **Frontend:** Next.js 15 + TypeScript + React 18
- **Styling:** TailwindCSS + shadcn/ui components
- **Database:** Supabase (PostgreSQL)
- **State Management:** TanStack Query
- **Deployment:** Vercel / Netlify

## Xususiyatlar

- ✅ **Multi-role system** - client, worker, admin rollari
- ✅ **Product catalog** - categories va subcategories bilan
- ✅ **Shopping cart** - to'liq cart functionality
- ✅ **Order management** - buyurtmalar tizimi
- ✅ **Worker profiles** - reviews, ratings, contact options
- ✅ **Admin dashboard** - to'liq statistika va boshqaruv
- ✅ **Telegram bot integration** - to'liq integratsiya
- ✅ **Mobile-responsive design** - iOS-style dizayn
- ✅ **Server-side rendering** - Next.js SSR/SSG

## O'rnatish

1. Loyihani klonlash:
```bash
git clone <repository-url>
cd metalbaza-nextjs
```

2. Dependencies o'rnatish:
```bash
npm install
```

3. Environment variables sozlash:
```bash
cp .env.example .env.local
```

4. Supabase database setup:
```sql
-- database-full-migration.sql faylini Supabase SQL Editor da ishga tushiring
```

5. Development server ishga tushirish:
```bash
npm run dev
```

## Deployment

### Vercel
1. Vercel account yarating
2. GitHub repository ni bog'lang
3. Environment variables qo'shing
4. Deploy qiling

### Netlify
1. Netlify account yarating
2. GitHub repository ni bog'lang
3. Build settings: `npm run build`
4. Publish directory: `.next`
5. Environment variables qo'shing
6. Deploy qiling

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
```

## API Routes

- `/api/categories` - Kategoriyalar
- `/api/products` - Mahsulotlar
- `/api/cart` - Savat
- `/api/orders` - Buyurtmalar
- `/api/workers` - Ustalar
- `/api/auth/telegram` - Telegram auth

## Loyiha strukturasi

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── layout/        # Layout components
│   ├── pages/         # Page components
│   ├── product/       # Product components
│   └── ui/            # UI components
├── hooks/             # Custom hooks
└── lib/               # Utilities
```

## Telegram Bot Integration

Telegram bot avtomatik ravishda web app bilan integratsiya qilingan. Foydalanuvchilar bot orqali ro'yxatdan o'tib, web app da avtomatik login bo'lishadi.

## Mobile Design

iOS-style responsive dizayn bilan barcha qurilmalarda mukammal ishlaydi:
- Mobile-first approach
- Touch-friendly interface
- Bottom navigation
- Swipe gestures

## Xavfsizlik

- Row Level Security (RLS) Supabase da
- Telegram ID orqali autentifikatsiya
- Role-based access control
- Secure API endpoints

## Qo'llab-quvvatlash

Texnik yordam uchun murojaat qiling.