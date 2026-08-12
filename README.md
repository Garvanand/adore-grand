# 🚗 AdorePark — Premium Residential Parking & Coordination Platform
> **Adore Grand • Sector 85 • Faridabad, Haryana**

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-emerald?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](LICENSE)

AdorePark is a modern, zero-cost, privacy-first parking coordination platform built specifically for modern residential gated communities. Designed for **Adore Grand (Sector 85, Faridabad)**, it replaces frustrating parking blockages and guard-house shouting with an effortless 1-tap resident communication workflow.

---

## 🆘 Technical Emergency Contact

For technical emergencies, server outages, database issues, or app support, contact lead developer:
- ✉️ **Technical Emergency Email**: [`garvanand03@gmail.com`](mailto:garvanand03@gmail.com)

---

## ✨ Why AdorePark?

In high-density residential societies, double-parking and driveway blockages occur daily. Traditional solutions require physical security guard interventions, loud shouting, or broadcasting unmasked phone numbers in public WhatsApp groups.

**AdorePark solves this entirely:**
- ⚡ **60-Second Resolution**: Contact blocking vehicle owners in 1 tap via masked calls or direct WhatsApp alerts.
- 🎨 **Friendly Illustrated Design**: Built with a bright, welcoming light mode visual world tailored for both 60+ senior residents and young professionals.
- 🗺️ **Interactive U-Shape Society Map**: Top-down interactive parking zone visualizer representing Towers T1 to T7, Mandir, Central Park, and Park Boundary.
- 📱 **Zero-Cost & Zero-Hardware**: Operates 100% on standard web browsers with Progressive Web App (PWA) instant installation — no expensive RFID booms or paid SMS APIs required.

---

## 🏛️ Adore Grand Interactive Map & Vector Visual World

AdorePark features a custom-engineered vector illustration system tailored strictly to Adore Grand's real-world U-shaped architecture:

```text
               T3 (Tower 3) ─── T4 (Tower 4) ─── T5 (Tower 5)
                    │                                 │
  T2 (Tower 2) ─────┤         CENTRAL PARK            ├───── T6 (Tower 6)
  Mandir       ─────┤      Park Boundary Parking      ├───── T7 (Tower 7)
  T1 (Tower 1) ─────┘                                 └───── Entry Gate
  Exit Gate
```

- **Interactive Zone Selector**: Tap any tower (`T1`..`T7`), `Mandir`, or `Park Boundary` to view active vehicle slots and launch assistance workflows.
- **Custom Vector Vehicles**: Recognizable SVG vehicle illustrations for Sedans, SUVs, Motorcycles, Scooters, and EVs with dynamic color customizers.

---

## 🚀 Key Features

### 1. 🔍 Instant Vehicle Lookup & Privacy Masking
- Search any vehicle plate number (e.g. `HR26AB1234` or `HR-26-AB-1234`).
- Automatic plate normalization handles spaces, hyphens, and lowercase inputs cleanly.
- Displays resident tower, flat number, and vehicle specs while **masking phone numbers** (`+91 98*** ***210`) for privacy.

### 2. 🚨 Guided "I'm Blocked" Assistance Workflow
A friendly 5-step guided wizard that walks residents through incident resolution:
1. **Plate Input**: Enter the blocking vehicle registration.
2. **Location Selection**: Select exact spot on the interactive U-shape society map.
3. **Vehicle Confirmation**: Inspect vector vehicle preview & owner tower details.
4. **Optional Photo**: Attach spot picture for gate security.
5. **Instant Alert & Escalation**: 1-tap call, WhatsApp alert, or escalate directly to Gate 1 Duty Security Guard.

### 3. 📢 Society Notice Board & Announcements Studio
- **Resident Notice Board**: Real-time society announcements for basement cleaning, lift maintenance, and parking rules.
- **Super Admin Studio**: RWA administrators can post, categorize (`urgent`, `parking`, `maintenance`), and pin notices directly to `/announcements`.

### 4. 📞 Emergency & Maintenance Contacts Desk
Direct 1-tap access to society duty personnel at [/emergency](file:///c:/Users/GARV%20ANAND/Downloads/Adore%20CMS/src/app/emergency/page.tsx):
- 🛡️ **Sagar** *(Security & Maintenance Head)* — `8130037280`
- 👮 **Happy** *(Security Duty Officer)* — `8800357292`
- ⚡ **Mohit** *(Electrician)* — `9315273368`
- 🛗 **Satish** *(Lift Maintenance Technician)* — `9565498118`
- 📍 **Maintenance Office**: Located under Tower T7 / Gate 1 Entrance Security Desk.
- ✉️ **Tech Support**: `garvanand03@gmail.com`

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Styling**: Vanilla CSS Modules & Tailwind CSS (Fresh Emerald `#059669`, Sky Blue `#0284c7`, Warm Gold `#d97706`, Coral `#e11d48`)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with Mongoose ORM
- **Security**: PBKDF2 Password Hashing (100,000 iterations), Signed HttpOnly JWT Cookies, Role-Based Access Control (`resident`, `security`, `admin`, `super_admin`)
- **PWA & Web Push**: VAPID Web Push Notifications, Service Worker caching, and native `beforeinstallprompt` Add to Home Screen trigger.

---

## 📦 Getting Started

### 1. Prerequisites
- Node.js 18.x or 20.x
- MongoDB Atlas cluster URI

### 2. Installation & Setup

```bash
# Clone repository
git clone https://github.com/Garvanand/adore-grand.git
cd adore-grand

# Install dependencies
npm install

# Configure Environment Variables
cp .env.example .env.local
```

Edit `.env.local` with your MongoDB URI and secrets:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/adorepark?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_token_key_here_32chars_min
DEV_AUTH_MODE=true
```

### 3. Run Locally

```bash
# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Credentials & Access Roles

| Role | Username / Identifier | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `garvanand03` | `Garv@516002` | `/admin` |
| **Security Guard** | `guard_gate1` | `Guard@123456` | `/security` |
| **Resident** | *1-Step Quick Sign-In* | *Zero Password* | `/dashboard` |

---

## 📄 License

Distributed under the MIT License. Built with ❤️ for the residents of **Adore Grand, Sector 85, Faridabad**.
