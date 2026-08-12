# AdorePark — Database Schema & Indexing Guide
**Society**: Adore Grand, Sector 85, Faridabad, Haryana, India  
**Engine**: MongoDB Atlas Serverless / Shared Cluster

---

## 1. Mongoose Collections & Schema Definitions

### 1.1 `users`
Stores residents, security guards, administrators, and super administrators.
- `_id`: ObjectId
- `phone`: String (Unique, Indexed, e.g. `+919876543210`)
- `name`: String
- `role`: Enum (`resident`, `security`, `admin`, `super_admin`)
- `tower`: Enum (`T1`, `T2`, `T3`, `T4`, `T5`, `T6`, `T7`, `Gate 1`, `RWA Office`)
- `flatNumber`: String (e.g. `1204`)
- `username`: String (Sparse Unique, for Staff & Super Admin)
- `passwordHash`: String (Salted PBKDF2 hash)
- `isVerified`: Boolean
- `status`: Enum (`active`, `pending`, `suspended`)
- **Indexes**: `{ phone: 1 }` (Unique), `{ username: 1 }` (Sparse Unique), `{ tower: 1, flatNumber: 1 }`

### 1.2 `vehicles`
Stores registered vehicles mapped to resident flats.
- `_id`: ObjectId
- `plateNumber`: String (Normalized Unique, e.g. `HR26AB1234`)
- `rawPlateNumber`: String (User entered display string)
- `ownerId`: ObjectId (Ref `User`)
- `vehicleType`: Enum (`car`, `bike`, `scooter`, `other`)
- `makeModel`: String
- `color`: String
- `tower`: Enum (`T1`..`T7`)
- `flatNumber`: String
- `parkingSlot`: String
- `parkingZone`: Enum (`T1`..`T7`, `MANDIR`, `PARK_BOUNDARY`, `OTHER`)
- `status`: Enum (`active`, `suspended`)
- **Indexes**: `{ plateNumber: 1 }` (Unique), `{ ownerId: 1 }`, `{ tower: 1, flatNumber: 1 }`

### 1.3 `incidents`
Tracks parking blockage reports and escalation state machine.
- `_id`: ObjectId
- `incidentNumber`: String (Unique, e.g. `INC-2026-0001`)
- `plateNumber`: String (Normalized)
- `reportedBy`: ObjectId (Ref `User`)
- `ownerId`: ObjectId (Ref `User`)
- `location`: Enum (`T1`..`T7`, `MANDIR`, `PARK_BOUNDARY`, `OTHER`)
- `status`: Enum (`OPEN`, `CONTACT_ATTEMPTED`, `OWNER_ACKNOWLEDGED`, `REMINDER_SENT`, `ESCALATED`, `RESOLVED`, `CANCELLED`)
- `timeline`: Array of `{ timestamp, status, updatedBy, note }`
- **Indexes**: `{ status: 1, createdAt: -1 }`, `{ plateNumber: 1, status: 1 }`

### 1.4 `parkingZones`
Stores active society parking zones.
- `_id`: ObjectId
- `code`: String (Unique, e.g. `T1`, `MANDIR`)
- `name`: String
- `description`: String
- **Indexes**: `{ code: 1 }` (Unique)

### 1.5 `pushSubscriptions`
Stores Web Push VAPID subscriptions for browser push notifications.
- `_id`: ObjectId
- `userId`: ObjectId (Ref `User`)
- `endpoint`: String (Unique)
- `keys`: `{ p256dh, auth }`
- **Indexes**: `{ userId: 1 }`, `{ endpoint: 1 }` (Unique)

---
*Maintained by Adore Grand Engineering Team.*
