# MetalBaza - Telegram Bot Integrated Marketplace

## Overview
Telegram bot integratsiyali metalbaza uchun o'zbek tilida iOS uslubidagi qora-oq xizmat platformasi. Bu loyiha React/TypeScript frontend, Express.js backend, PostgreSQL database va Telegram bot integratsiyasi bilan qurilgan to'liq xizmat marketplace platformasidir.

## Recent Changes
**2025-01-17 - Barcha funksionallik to'liq yakunlandi:**
- ✅ Bottom navigation mobile responsive qilindi (ekran o'lchamiga qarab elementlar moslashadi)
- ✅ Worker profiles to'liq amalga oshirildi (reviews, ratings, contact options)
- ✅ Worker review tizimi to'liq ishlaydi (5 yulduzli rating system)
- ✅ Worker application tizimi yaratildi (bog'lanish va ariza yuborish)
- ✅ Admin panel to'liq funksional (statistics, users, orders, products management)
- ✅ Role switching tizimi (admin/client o'rtasida)
- ✅ Catalog sahifasida URL routing muammosi hal qilindi
- ✅ Barcha API routes yaratildi va test qilindi
- ✅ Mobile-first responsive dizayn amalga oshirildi

## Project Architecture
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Express.js + TypeScript  
- **Database:** PostgreSQL (Supabase)
- **Styling:** TailwindCSS + shadcn/ui components
- **State Management:** TanStack Query for server state
- **Telegram Integration:** Bot API bilan to'liq integratsiya
- **Mobile Design:** iOS-style responsive components

## Key Features Implemented
- ✅ **Multi-role system** - client, worker, admin rollari
- ✅ **Product catalog** - categories va subcategories bilan
- ✅ **Shopping cart** - to'liq cart functionality
- ✅ **Order management** - buyurtmalar tizimi
- ✅ **Worker profiles** - reviews, ratings, contact options
- ✅ **Worker applications** - mijozlar bilan bog'lanish tizimi
- ✅ **Admin dashboard** - to'liq statistika va boshqaruv
- ✅ **Telegram bot integration** - to'liq integratsiya
- ✅ **Mobile-responsive design** - iOS-style dizayn
- ✅ **Role switching** - rollar o'rtasida o'tish
- ✅ **Advertisement system** - reklama tizimi
- ✅ **Review system** - 5 yulduzli baholash tizimi

## User Preferences
- Keep main categories on home page, add subcategories only in catalog section ✅
- Implement iOS-style design with Untitled UI components throughout ✅
- Create separate ModderSheet system that can be extracted later as independent system ✅
- Add worker popup profiles with reviews, contact options, and application system ✅
- Implement role switching between client/worker modes ✅
- Make bottom navigation fully responsive for mobile with elements scaling based on screen size ✅
- Implement ALL features without missing anything ✅
- Handle database setup themselves (SQL only needed) ✅
- Mobile-first design with responsive bottom navigation ✅

## Technical Decisions
- **URL Routing Fix:** Catalog sahifasida category selection to'g'ri ishlaydi
- **Supabase Integration:** PostgreSQL database uchun to'liq integratsiya
- **Worker Review System:** 5 yulduzli rating va comment system
- **Admin Panel:** Statistics, user management, role switching
- **Mobile Responsiveness:** Bottom navigation va barcha componentlar responsive
- **API Architecture:** RESTful API design pattern
- **Authentication:** Telegram-based auth system

## API Endpoints Implemented
- ✅ `/api/workers` - Worker ro'yxati (reviews bilan)
- ✅ `/api/workers/:id/reviews` - Worker sharhlari
- ✅ `/api/worker-applications` - Worker arizalari
- ✅ `/api/admin/stats` - Admin statistikalar
- ✅ `/api/admin/orders` - Admin buyurtmalar
- ✅ `/api/admin/users` - Admin foydalanuvchilar
- ✅ `/api/categories/:id/subcategories` - Subkategoriyalar
- ✅ `/api/users/:id/switch-role` - Rol almashish

## Development Status
✅ **COMPLETE** - Barcha core features amalga oshirildi va test qilindi
✅ **Database schema** to'liq amalga oshirilgan
✅ **API routes** barcha funksional
✅ **Frontend components** responsive va ishlaydi  
✅ **Worker system** reviews bilan operational
✅ **Admin panel** to'liq funksional
✅ **Mobile responsive design** amalga oshirilgan
✅ **Bottom navigation** mobile uchun optimallashtirilgan

## Database Schema Status
- ✅ Users table with role system
- ✅ Categories with subcategory support (parent_id)
- ✅ Products with availability tracking
- ✅ Orders with items relation
- ✅ Cart functionality
- ✅ Worker reviews system (rating, comment, created_at)
- ✅ Worker applications system
- ✅ Advertisements system
- ✅ All foreign key relationships established

## Current State: PRODUCTION READY
Loyiha to'liq tayyor va deploy qilish mumkin. Barcha asosiy funksionallik ishlaydi:
- Mobile responsive dizayn
- Worker profiles va review system
- Admin panel bilan to'liq boshqaruv
- Telegram bot integratsiyasi
- Role-based access control