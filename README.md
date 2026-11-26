# Mashuup Cafe: Restaurant Website and Admin Dashboard

Website and admin portal for **Mashuup Cafe**, a 100% pure veg street food cafe in Chhindwara, Madhya Pradesh.

**Live site:** https://mashuup-restaurant.vercel.app

## Features

**Public website**
- Home, Menu, About, Gallery, Contact and Location pages
- Menu organised by category, with prices and images
- Call, WhatsApp, email and Instagram links
- Opening hours and Google Maps

**Admin dashboard** (`/admin`, login required)
- Manage menu items and categories
- Manage the gallery, opening hours, restaurant details and contact information
- Manage admin accounts. Only the configured super admin can delete them.

Online ordering, payments and billing are not included.

## Tech Stack
- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4
- Prisma 6 with PostgreSQL
- Authentication with `jose` (JWT in an HTTP-only cookie) and `bcryptjs`
- Resend for OTP emails

## Getting Started

### Requirements
- Node.js 20.9 or newer
- A PostgreSQL database for development (for example, Neon)

### 1. Install
```bash
git clone https://github.com/ShivamMungbhate/mashuup-restaurant.git
cd mashuup-restaurant
npm install
```

### 2. Configure
Create a `.env` file in the project root. Never commit it.
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
JWT_SECRET="replace-with-a-long-random-value"
RESEND_API_KEY=""
```

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes in production | Signs admin sessions. Generate one with `openssl rand -base64 32`. |
| `RESEND_API_KEY` | For OTP emails | Without it, the OTP is logged and returned to the logged-in admin. Use that only for development. |

### 3. Set up the database
```bash
npx prisma migrate deploy
```

To load starter data into a **new, empty** database, first set your own admin email and password in `prisma/seed.ts` (do not commit them), then run:
```bash
npm run db:seed
```

> **Warning:** seeding deletes existing data, including admin accounts, restaurant details, opening hours and the menu. Never run it on your live database.

### 4. Run
```bash
npm run dev
```
Open http://localhost:3000. The admin login is at http://localhost:3000/admin/login.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Generates the Prisma client, **applies migrations to the database**, and builds the app |
| `npm start` | Runs the production build |
| `npm run lint` | Runs ESLint |
| `npm run db:migrate` | Creates and applies a migration (development only) |
| `npm run db:push` | Pushes the schema without a migration (use with care) |
| `npm run db:seed` | Replaces data with starter data (destructive) |

## Project Structure
```
prisma/                 Database schema, migrations and seed
public/                 Logos and static files
src/app/                Public pages, admin pages and API routes
src/components/public/  Website components
src/components/admin/   Dashboard components
src/lib/                Authentication and Prisma client
src/middleware.ts       Protects admin pages
```

## Deployment
1. Import the repository into your hosting provider.
2. Add the environment variables in the provider's settings.
3. Deploy.

Vercel's Hobby plan is for non-commercial use only. A business site on Vercel needs a Pro or Enterprise plan.

## Notes and Limitations
- The super admin email is set in `src/app/api/admin/users/route.ts`.
- Image uploads are saved to `public/uploads` on the server. This does not provide persistent storage on Vercel, so use a service such as Vercel Blob or Cloudinary.
- The embedded map coordinates are set in `src/components/public/ContactSection.tsx`.

## Security
- Never put passwords, API keys or connection strings in this repository.
- Use a unique, strong password for each admin.