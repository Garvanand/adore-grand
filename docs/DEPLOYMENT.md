# AdorePark — Zero-Cost Deployment Guide (Vercel + MongoDB Atlas)
**Society**: Adore Grand, Sector 85, Faridabad, Haryana, India

---

## 1. Zero-Cost Infrastructure Architecture

AdorePark is engineered to run 100% free of charge without requiring paid SMS gateways, paid Redis, or paid microservices infrastructure:

- **Frontend & App Server**: Next.js 15 App Router deployed to **Vercel Hobby Plan** (Free forever).
- **Database**: **MongoDB Atlas Shared Cluster** M0 (Free 512MB MongoDB database in AWS Mumbai `ap-south-1`).
- **Authentication**: Native JWT Session Cookies (`jose` library) stored in `HttpOnly` cookies.
- **Notifications**: Browser Web Push API (VAPID) + Direct WhatsApp deep links (`wa.me`) + Direct phone calls (`tel:`).
- **PWA Capabilities**: Service Worker & Web App Manifest for native Android home screen installation.

---

## 2. Step-by-Step Vercel Deployment

1. **Push Workspace Code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Deploy AdorePark Master"
   git push origin main
   ```

2. **Import Project to Vercel**:
   - Log in to [Vercel Dashboard](https://vercel.com).
   - Select **New Project** $\rightarrow$ Import your `adorepark` repository.
   - Framework Preset: **Next.js**.

3. **Configure Environment Variables**:
   In Vercel Project Settings $\rightarrow$ Environment Variables, set:

   ```env
   MONGODB_URI=mongodb+srv://garvanand03_db_user:<password>@cluster0.nuj7pee.mongodb.net/adorepark?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_2026_32chars_min
   NEXT_PUBLIC_APP_URL=https://adorepark.vercel.app
   DEV_AUTH_MODE=false
   ```

4. **Deploy**:
   Click **Deploy**. Vercel will build static assets, route handlers, and automatically issue an SSL certificate for `https://adorepark.vercel.app`.

---

## 3. Seed Production Database

Run database seeding from your local environment or deployment script:

```bash
npx tsx scripts/seed.ts
```

This seeds:
- Super Admin: Username `garvanand03` | Password `Garv@516002`
- 10 Adore Grand Parking Zones (`T1`..`T7`, `MANDIR`, `PARK_BOUNDARY`, `OTHER`)
- Initial Security Guard and Resident test profiles

---
*Created for Adore Grand Society Parking Coordination.*
