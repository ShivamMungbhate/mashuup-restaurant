# 🫒 THE OLIVE TABLE — Production-Ready Restaurant Website & Owner Dashboard

A commercial-grade, full-stack restaurant website with an isolated, secure Owner/Admin Dashboard. Customers can explore the restaurant, filter dynamic food menus, view photo galleries, and check operating hours. Restaurant owners can log into a secure dashboard to manage all website content (menu items, categories, restaurant story, contact details, opening hours, photo gallery) in real time without modifying source code.

---

## 🌟 Key Features

### 🍽️ Public Restaurant Website
1. **Homepage (`/`)**:
   - Hero banner with high-resolution imagery, tagline, and instant menu action buttons.
   - Dynamic **Featured & Popular Dishes** carousel/grid.
   - **About Us** section detailing restaurant story and culinary philosophy.
   - Interactive **Photo Gallery** teaser.
   - **Contact & Location** section with live operating status, address, and interactive Google Maps.
   - Dynamic **Footer** automatically pulling live contact info and opening hours.
2. **Menu Page (`/menu`)**:
   - Organized by dynamic categories (Starters, Main Course, Rice & Biryani, Breads, Desserts, Beverages).
   - Instant search bar & Veg/Non-Veg filter pills.
   - Dish image, description, price tag, vegetarian/non-vegetarian indicators, availability status, and chef's special badges.
   - Dynamic loading from database (no hardcoded frontend items).
3. **About Page (`/about`)**:
   - Full restaurant story, chef background, and culinary values.
4. **Gallery Page (`/gallery`)**:
   - Responsive photo grid with hover zoom effects, image captions, and full-screen Lightbox viewer with Next/Previous controls.
5. **Location Page (`/location`)**:
   - Address, interactive "Get Directions" link, embedded Google Maps view, and complete opening schedule.
6. **Contact Page (`/contact`)**:
   - Dynamic phone, email, address, Instagram profile link, and interactive inquiry form with validation feedback.

---

### 🛡️ Owner / Admin Dashboard (`/admin`)
1. **Secure Authentication (`/admin/login`)**:
   - Password hashing (`bcryptjs`) & HTTP-only JWT session cookies.
   - Next.js Edge middleware guarding all `/admin/*` routes.
2. **Dashboard Overview (`/admin`)**:
   - Key metric cards: Total Menu Items, Available Items, Categories Count, Photo Gallery Count.
   - Quick action buttons for common tasks.
   - Table of recently updated items.
3. **Menu Item Management (`/admin/menu`)**:
   - Full CRUD (Create, Read, Update, Delete) table.
   - Food image uploader (local file storage API) or image URL input.
   - Category selector, price, description, veg/non-veg toggle, availability toggle, and featured toggle.
   - Confirmation dialogs for deletion.
4. **Category Management (`/admin/categories`)**:
   - Create, rename, edit, and delete categories.
   - Safety checks preventing deletion of categories containing active menu items.
5. **Restaurant Profile (`/admin/restaurant`)**:
   - Live form to update Restaurant Name, Tagline, Short Description, About Story, Hero Image, and Main Photo.
6. **Contact & Location (`/admin/contact`)**:
   - Form to update Phone, Email, Address, Instagram Link, and Google Maps embed code.
7. **Opening Hours (`/admin/hours`)**:
   - Day-by-day scheduler for Monday through Sunday, supporting open/closed toggles and time slots.
8. **Gallery Manager (`/admin/gallery`)**:
   - Upload new gallery photos, edit captions, and remove photos.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14/15 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS, Framer Motion, Lucide Icons, Glassmorphism design system
- **Database & ORM**: Prisma ORM with SQLite (`prisma/dev.db`) for zero-dependency local execution, 100% compatible with PostgreSQL for production.
- **Authentication**: JWT (`jose`), `bcryptjs`, Next.js Middleware (`src/middleware.ts`)
- **File Uploads**: Custom Next.js File API route (`/api/upload`) saving to `public/uploads/`

---

## 🔑 Default Admin Credentials

- **URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@theolivetable.com`
- **Password**: `admin123`

---

## 🚀 Local Setup Instructions

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `.env` contains:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="the-olive-table-super-secret-jwt-key-2026"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PRISMA_CLIENT_ENGINE_TYPE="binary"
```

### 3. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 4. Database Setup & Seeding
Push schema to SQLite database and seed initial restaurant data:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Deployment Instructions (PostgreSQL & Vercel / Netlify)

1. **Database Migration to PostgreSQL**:
   In `prisma/schema.prisma`, update the datasource provider to `postgresql`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. **Set Environment Variables on Hosting Provider**:
   - `DATABASE_URL`: Your production PostgreSQL connection string (e.g., Supabase, Neon, Render, AWS RDS)
   - `JWT_SECRET`: A strong random secret key
   - `NEXT_PUBLIC_APP_URL`: Your live domain URL
3. **Build Command**: `npx prisma generate && npx prisma db push && npm run build`
4. **Start Command**: `npm start`
