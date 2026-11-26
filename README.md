# Mashuup Cafe - Restaurant Website and Owner Dashboard

A full-stack restaurant website and admin portal for **Mashuup Cafe**, a 100% Pure Veg street food cafe in Chhindwara, Madhya Pradesh.

## Live Site
https://mashuup-restaurant.vercel.app

## Admin Dashboard
https://mashuup-restaurant.vercel.app/admin

### Admin Login
- Super Admin (can delete accounts): shivammungbhate671@gmail.com
- Admin: square4oot@gmail.com / Shivam30

## Features
- Dynamic Menu: 12 categories, 60+ items with images, prices, dietary tags
- Admin Dashboard: full CRUD for menu items, categories, gallery, hours, contact
- Role-based Permissions: Super Admin can delete admin accounts; regular admins can add or edit
- OTP-verified Admin Registration: secure 3-step onboarding via email OTP (Resend)
- Photo Gallery Management: upload, caption, and delete gallery photos
- Opening Hours Management: per-day open/close time configuration
- Contact and Location: phone, email, address, Instagram, Google Maps embed
- WhatsApp Integration: direct customer chat link
- 100% Pure Veg: all menu items are vegetarian
- Responsive Design: mobile-first, works on all screen sizes
- Logo Upload: change restaurant logo from admin panel

## Tech Stack
- Next.js 15 (App Router)
- Prisma ORM + PostgreSQL (Neon)
- Tailwind CSS (green and white theme)
- Vercel (auto-deploy on push to main)

## Environment Variables
Set these in Vercel Settings - Environment Variables:
- DATABASE_URL: Neon PostgreSQL connection string
- JWT_SECRET: Session token secret key
- RESEND_API_KEY: (Optional) Resend API key for OTP emails
- NEXT_PUBLIC_APP_URL: App base URL

