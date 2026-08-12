# AdorePark — Step-by-Step Installation & Setup Guide
**Society**: Adore Grand, Sector 85, Faridabad, Haryana, India  
**Target Architecture**: Next.js 15, Vercel, MongoDB Atlas, PWA, Web Push

---

## 1. Prerequisites

- Node.js version `v20.x` or higher
- npm or yarn
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0 Cluster account

---

## 2. Environment Variables Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure the following parameters in `.env.local`:

```env
# MongoDB Atlas Database URI
MONGODB_URI=mongodb+srv://garvanand03_db_user:<password>@cluster0.nuj7pee.mongodb.net/adorepark?retryWrites=true&w=majority

# JWT Session Secret (Minimum 32 random characters)
JWT_SECRET=adorepark_super_secret_jwt_token_key_2026_32chars

# Application Branding & URL
NEXT_PUBLIC_APP_NAME=AdorePark
NEXT_PUBLIC_SOCIETY_NAME=Adore Grand
NEXT_PUBLIC_SOCIETY_LOCATION=Sector 85, Faridabad, Haryana
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication Mode (Set to true for dev quick auth & 123456 test OTP)
DEV_AUTH_MODE=true

# Web Push VAPID Keypair (Zero-Cost Browser Notifications)
VAPID_PUBLIC_KEY=BCKERKKugNgY7v6t7-44HG13v4rofSNi8bAdcZxMWwv_lg86kXegVHvvTPJe0AkHkuBz_rNgJKpne6T5yG7Q1I4
VAPID_PRIVATE_KEY=OMQSKuz7BdODyKPEIRCknhQhTRRzvJZZsNR_hY3qnLM
VAPID_SUBJECT=mailto:security@adorepark.in
```

---

## 3. Database Seeding

Run the database seed script to initialize Adore Grand parking zones (`T1`..`T7`, `MANDIR`, `PARK_BOUNDARY`, `OTHER`), Super Admin `garvanand03`, Security Guard, test residents, and test vehicles:

```bash
npx tsx scripts/seed.ts
```

Output:
```text
🌱 Seeding AdorePark MongoDB Atlas Database...
✅ Seeded 10 Adore Grand Parking Zones (T1-T7, MANDIR, PARK_BOUNDARY, OTHER)
✅ Seeded Super Admin User: garvanand03
✅ Seeded Security Guard Account: Ramesh Kumar
✅ Seeded Test Residents across Towers T1, T3, T5
✅ Seeded Test Vehicles: HR26AB1234, HR38X9988, DL3CBT5544
🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!
Super Admin Credentials: garvanand03 / Garv@516002
```

---

## 4. Local Development Server

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Web Push Notification Testing

1. Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).
2. Click **Enable Notifications** when prompted.
3. Allow browser notifications.
4. Report an incident against `HR26AB1234`. The vehicle owner receives an instant browser Web Push notification via VAPID.

---

## 6. PWA & Mobile Home Screen Testing

1. Open [http://localhost:3000](http://localhost:3000) on Android Chrome or via Chrome DevTools Mobile View.
2. Tap **Add AdorePark to your phone** or select **Add to Home Screen** from the browser menu.
3. The app installs as a standalone Android application shortcut.

---

## 7. Production Deployment to Vercel

```bash
# Push code to GitHub
git add .
git commit -m "Deploy AdorePark to Vercel"
git push origin main

# Vercel Deployment Command
vercel --prod
```

Configure `MONGODB_URI`, `JWT_SECRET`, and `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` in your Vercel Project Settings.

---
*Maintained by Adore Grand RWA & Security Team.*
