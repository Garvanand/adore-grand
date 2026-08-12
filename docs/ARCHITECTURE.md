# AdorePark — Architecture & Design Specification
**Society**: Adore Grand, Sector 85, Faridabad, Haryana, India  
**Version**: 1.0.0 (Production Blueprint)

---

## 1. Executive Summary & Problem Statement

At **Adore Grand (Sector 85, Faridabad)**, parking coordination during night hours and peak times currently relies on noisy, unorganized WhatsApp groups. Residents post vehicle photos, registration plates, and contact numbers seeking owners when cars block driveways or reserved slots. This leads to:
- **Privacy Exposure**: Resident phone numbers and vehicle data are exposed publicly in open group chats.
- **Delayed Resolution**: Messages get buried in chatter, and off-duty/sleeping owners miss critical requests.
- **Lack of Tracking & Accountability**: No audit trail or escalation mechanism to security guards when an owner does not respond.

**AdorePark** is a lightweight, high-performance parking coordination web application designed specifically for **Adore Grand**. It provides instant vehicle lookup, masked contact options, quick move request notifications, real-time escalation to society security guards, and administrative auditing.

---

## 2. Core Workflows & User Roles

### User Roles & Authorization Hierarchy
1. **Resident**: Can search vehicles, send move requests, escalate incidents, manage their own registered vehicles, view incoming move requests, and update their availability state ("On my way", "Moved").
2. **Security**: Duty mode dashboard to view active blockages, receive escalated incidents, contact residents directly, dispatch guards, and mark incidents resolved.
3. **Admin**: Approves newly registered residents/vehicles, manages society flat directory, views audit logs, and monitors parking analytics.
4. **Super Admin**: System configuration, society setting overrides, role assignments, and full audit control.

### End-to-End Workflow Diagram

```
[ Resident / Guard ] ──> Search Vehicle Number (e.g. HR38AB1234)
                              │
                              ▼
                     Owner Found & Flat Info Displayed
                     (Phone number masked for privacy)
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
      [ Direct Tel Action ]        [ Send Move Request ]
      (Guard / Verified)           (In-App Alert / Nudge)
                                             │
                                             ▼
                                   Resident Responds?
                                    ┌────────┴────────┐
                                   YES               NO (or Timeout)
                                    │                 │
                                    ▼                 ▼
                             [ Resolved ]     [ Escalate Incident ]
                                                      │
                                                      ▼
                                           [ Security Dashboard ]
                                           - Guard Dispatched
                                           - Incident Resolved & Audited
```

---

## 3. Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Framer Motion (Animations) + Lucide Icons
- **UI Architecture**: Primitive component system (Buttons, Cards, Dialogs, Badges, Tabs, Toasts, Inputs)
- **Backend Logic**: Next.js Route Handlers & Server Actions
- **Validation**: Zod schema validation for API payloads and form inputs
- **Database**: MongoDB Atlas with Mongoose (Indexing on plate numbers, phone numbers, and flat numbers)
- **Auth Architecture**: Session JWT stored in HTTP-Only Secure Cookies with dual-mode runtime (Dev Quick-Auth Mode & Phone OTP Architecture)
- **Deployment**: Vercel ready

---

## 4. Data Models & Database Schemas

### 4.1 `users` Collection
Stores resident profiles, guards, and administration staff.
- `_id`: ObjectId
- `phone`: String (Unique, Indexed, E.164 format `+91XXXXXXXXXX`)
- `name`: String
- `role`: Enum (`'resident'`, `'security'`, `'admin'`, `'super_admin'`)
- `tower`: String (e.g., `'Tower A'`, `'Tower B'`, `'Tower C'`, `'Tower D'`)
- `flatNumber`: String (e.g., `'702'`, `'104'`)
- `isVerified`: Boolean (Admin verification state)
- `status`: Enum (`'active'`, `'suspended'`)
- `createdAt`, `updatedAt`: Date

### 4.2 `vehicles` Collection
Stores registered vehicles linked to residents.
- `_id`: ObjectId
- `plateNumber`: String (Unique, Upper-case normalized without spaces/hyphens, e.g. `HR85AB1234`)
- `rawPlateNumber`: String (Formatted plate string, e.g. `"HR 85 AB 1234"`)
- `vehicleType`: Enum (`'car'`, `'bike'`, `'ev'`, `'commercial'`)
- `makeModel`: String (e.g., `"White Hyundai Creta"`)
- `ownerId`: ObjectId (Ref `users`)
- `tower`: String (Denormalized for fast lookup)
- `flatNumber`: String (Denormalized for fast lookup)
- `parkingSlot`: String (e.g., `"B1-42"` or `"Visitor Parking"`)
- `stickerId`: String (Society gate pass sticker #)
- `photoUrl`: String (Optional vehicle image)
- `status`: Enum (`'active'`, `'unregistered'`, `'flagged'`)
- `createdAt`, `updatedAt`: Date

### 4.3 `incidents` Collection
Tracks parking disputes and escalations.
- `_id`: ObjectId
- `incidentNumber`: String (Human readable e.g., `"INC-2026-0042"`)
- `vehicleId`: ObjectId (Ref `vehicles`, nullable for unlisted vehicles)
- `plateNumber`: String (Normalized)
- `reportedBy`: ObjectId (Ref `users`)
- `ownerId`: ObjectId (Ref `users`, nullable)
- `location`: String (e.g., `"Basement 1 near Pillar B-12"`)
- `status`: Enum (`'pending_nudge'`, `'escalated'`, `'guard_assigned'`, `'resolved'`, `'cancelled'`)
- `priority`: Enum (`'normal'`, `'urgent'`)
- `description`: String
- `imageUrls`: Array of String
- `resolvedBy`: ObjectId (Ref `users`, nullable)
- `resolutionNote`: String
- `timeline`: Array of `{ timestamp: Date, status: String, updatedBy: Ref users, note: String }`
- `createdAt`, `updatedAt`: Date

### 4.4 `notifications` Collection
In-app notification system for move requests and status updates.
- `_id`: ObjectId
- `recipientId`: ObjectId (Ref `users`)
- `senderId`: ObjectId (Ref `users`)
- `type`: Enum (`'move_request'`, `'incident_escalated'`, `'incident_resolved'`, `'account_verified'`)
- `title`: String
- `message`: String
- `incidentId`: ObjectId (Ref `incidents`, optional)
- `vehicleId`: ObjectId (Ref `vehicles`, optional)
- `isRead`: Boolean (Default `false`)
- `createdAt`: Date

### 4.5 `auditLogs` Collection
Security and administrative tracking for auditability.
- `_id`: ObjectId
- `actorId`: ObjectId (Ref `users`)
- `action`: String (e.g., `'VEHICLE_SEARCH'`, `'MOVE_REQUEST_SENT'`, `'INCIDENT_ESCALATED'`, `'INCIDENT_RESOLVED'`, `'USER_VERIFIED'`, `'ROLE_CHANGED'`)
- `targetType`: Enum (`'vehicle'`, `'incident'`, `'user'`)
- `targetId`: ObjectId
- `details`: Object (Metadata snapshot)
- `ipAddress`: String
- `createdAt`: Date

---

## 5. Security & Privacy Model

1. **Phone Privacy**: Phone numbers are masked in search responses for standard residents (e.g., `+91 98*** **321`). Only verified Security and Admins can view complete unmasked phone numbers when resolving active disputes.
2. **Role-Based Access Control (RBAC)**: Next.js middleware and server-side utilities enforce role permissions on every API endpoint and Server Action.
3. **Database Security**: Server-side database access only. Database credentials (`MONGODB_URI`) are never bundled into client scripts.
4. **Input Sanitization**: All inputs validated via Zod schemas; vehicle numbers normalized (strip spaces, hyphens, non-alphanumeric, convert to uppercase).

---

## 6. Authentication Architecture

- **Production Mode**: Phone OTP architecture (integrates with Indian SMS providers like MSG91/Fast2SMS/Twilio).
- **Development & Demo Mode**: Toggleable via `DEV_AUTH_MODE=true` environment variable. Provides:
  - Instant pre-seeded role selection ("Login as Resident Flat A-702", "Login as Guard", "Login as Admin").
  - Test OTP (`123456`) for any registered phone number.
- **Session Tokens**: JWT stored in HttpOnly, SameSite=Lax secure cookies (`adorepark_session`).

---

## 7. Directory & Project Structure

```
AdorePark/
├── docs/
│   └── ARCHITECTURE.md
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/            # Auth endpoints (send-otp, verify-otp, dev-login, me, logout)
│   │   │   ├── vehicles/        # Vehicle search, registration, CRUD
│   │   │   ├── incidents/       # Incident creation, escalation, resolution
│   │   │   ├── notifications/   # Resident notifications & move alerts
│   │   │   └── admin/           # Admin user management & audit logs
│   │   ├── dashboard/           # Resident dashboard & move request center
│   │   ├── security/            # Security Guard Duty Mode dashboard
│   │   ├── admin/               # Administrative panel & audit view
│   │   ├── search/              # Vehicle lookup page
│   │   ├── login/               # Auth page (Dev quick selector + OTP)
│   │   ├── layout.tsx           # Global root layout
│   │   └── page.tsx             # Landing hero & quick search
│   ├── components/
│   │   ├── ui/                  # Clean primitive UI components (Button, Card, Input, Modal, Badge, Toast)
│   │   ├── layout/              # Navbar, Sidebar, Footer, MobileNav
│   │   ├── vehicle/             # VehicleCard, SearchBar, AddVehicleModal
│   │   ├── incident/            # IncidentCard, EscalateModal, TimelineView
│   │   └── auth/                # AuthModal, DevRoleSelector
│   ├── lib/
│   │   ├── db/                  # MongoDB client & connection manager
│   │   ├── models/              # Mongoose models (User, Vehicle, Incident, Notification, AuditLog)
│   │   ├── auth/                # JWT session utilities, cookie helpers, RBAC checks
│   │   ├── validators/          # Zod validation schemas
│   │   ├── audit.ts             # Audit logging service
│   │   └── utils.ts             # Plate normalization, formatting helpers
│   └── types/                   # TypeScript interfaces & API payload types
├── public/                      # Static assets & branding icons
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 8. Deployment & Environment Setup

Environment variables required (`.env.local` / Vercel Environment Variables):
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/adorepark?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-32-chars-min
NEXT_PUBLIC_APP_NAME=AdorePark
NEXT_PUBLIC_SOCIETY_NAME=Adore Grand
NEXT_PUBLIC_SOCIETY_LOCATION=Sector 85, Faridabad, Haryana
DEV_AUTH_MODE=true
```

---
*Created for Adore Grand Society Parking Management.*
