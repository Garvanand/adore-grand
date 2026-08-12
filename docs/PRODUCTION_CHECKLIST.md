# AdorePark — Production Readiness & Deployment Checklist
**Society**: Adore Grand, Sector 85, Faridabad, Haryana, India  
**Version**: 1.0.0 (Production Master)

---

## 1. Environment Variables Configuration

Ensure the following variables are set in your Vercel Environment Settings / `.env.local`:

```env
# Database Connection (MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.nuj7pee.mongodb.net/adorepark?retryWrites=true&w=majority

# JWT Session Key (Minimum 32 random characters)
JWT_SECRET=adorepark_super_secret_jwt_token_key_2026_32chars

# Branding & Location Parameters
NEXT_PUBLIC_APP_NAME=AdorePark
NEXT_PUBLIC_SOCIETY_NAME=Adore Grand
NEXT_PUBLIC_SOCIETY_LOCATION=Sector 85, Faridabad, Haryana

# Development Authentication Toggle (Set to false in production)
DEV_AUTH_MODE=false
```

---

## 2. MongoDB Atlas Database Setup & Indexes

- **Cluster Tier**: Shared M0 / M10+ Cluster on AWS `ap-south-1` (Mumbai) for low latency (<20ms response time for Faridabad/NCR residents).
- **Core Indexes**:
  - `User`: `{ phone: 1 }` (Unique), `{ tower: 1, flatNumber: 1 }`, `{ role: 1, status: 1 }`
  - `Vehicle`: `{ plateNumber: 1 }` (Unique), `{ tower: 1, flatNumber: 1 }`, `{ ownerId: 1, status: 1 }`
  - `Incident`: `{ incidentNumber: 1 }` (Unique), `{ status: 1, createdAt: -1 }`, `{ reportedBy: 1, createdAt: -1 }`, `{ ownerId: 1, status: 1 }`, `{ plateNumber: 1, status: 1 }`
  - `Notification`: `{ recipientId: 1, isRead: 1, createdAt: -1 }`
  - `AuditLog`: `{ createdAt: -1 }`, `{ actorId: 1, createdAt: -1 }`

---

## 3. Vercel Deployment Guide

1. Push repository code to GitHub/GitLab.
2. Import project into Vercel Dashboard.
3. Set Framework Preset to **Next.js**.
4. Configure Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `DEV_AUTH_MODE=false`).
5. Deploy. (Automatic SSL/HTTPS certificate will be provisioned by Vercel).

---

## 4. Custom Domain & DNS Settings

- **Production Domain**: `adorepark.in` or `adoregrand.com/parking`
- **DNS Records**:
  - `A` Record: `76.76.21.21`
  - `CNAME` Record: `cname.vercel-dns.com`

---

## 5. Security & Rate Limiting Verification

- **Phone Privacy**: API masks resident phone numbers (`+91 98*** ***210`) for standard resident lookups.
- **Role-Based Access Control**: Middleware verifies session cookies (`adorepark_session`) and restricts `/dashboard`, `/security`, and `/admin` routes.
- **Sliding Window Rate Limiters**:
  - Vehicle search: Max 10 queries/min per IP (cap 5 results/query).
  - Incident creation: Max 3 reports/15 mins per user.
  - OTP dispatch: Max 5 requests/10 mins per IP.
- **Anti-Spam Check**: Blocks duplicate active incidents for same plate within 10 minutes.

---

## 6. Responsive Viewport Compliance

Tested and verified across mobile, tablet, and desktop breakpoints:
- `320px` (Small Android devices e.g. Galaxy A01)
- `375px` (iPhone SE)
- `390px` (iPhone 13 / 14 / 15)
- `414px` (iPhone Max series)
- `768px` (iPad Portrait / Android Tablets)
- `1024px` (iPad Landscape / Laptops)
- `1440px` (Desktop Monitors)

---

## 7. Backups, Monitoring & Incident Recovery

- **Atlas Automated Backups**: Daily continuous snapshots with 7-day point-in-time recovery (PITR).
- **Vercel Analytics & Web Vitals**: Monitor LCP, CLS, and INP metrics.
- **Error Tracking**: Integration ready for Sentry / LogTail.
- **Disaster Recovery**: RTO < 15 mins, RPO < 1 min via MongoDB Atlas replica sets.

---
*Created for Adore Grand Society Parking Management.*
