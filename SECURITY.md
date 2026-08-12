# SECURITY.md — AdorePark Security & Threat Model Specification
**Society**: Adore Grand, Sector 85, Faridabad, Haryana, India  
**Scope**: Production Parking Coordination Platform

---

## 1. Executive Security Architecture

AdorePark handles residential parking coordination for **Adore Grand**. Because residential applications store personal identifier data (resident names, flat numbers, phone numbers, vehicle plates), the application enforces strict multi-layered security controls to protect resident privacy and prevent unauthorized access or data extraction.

---

## 2. Core Security Controls

### 2.1 Resident Phone Privacy Protection
- **Phone Number Masking**: Public vehicle searches return masked phone numbers (e.g. `+91 98*** **321`) to all standard residents.
- **Restricted Unmasking**: Full unmasked resident phone numbers are accessible **only** to verified on-duty Security Officers and RWA Administrators responding to active parking disputes.
- **Server-Side Enforcement**: Masking logic is applied in API route handlers before JSON responses are sent to the client browser. Client code never receives raw unmasked phone numbers for unprivileged users.

### 2.2 Server-Side Authorization & Anti-IDOR
- **JWT HttpOnly Cookies**: Session state is signed using `jose` with `HS256` and stored in `HttpOnly`, `SameSite=Lax`, `Secure` cookies (`adorepark_session`).
- **Server-Side Checks**: Every sensitive API endpoint (`/api/vehicles`, `/api/incidents`, `/api/admin/*`) independently invokes `requireAuth()` or `requireRole()`. Frontend UI role checks are treated strictly as cosmetic display helpers.
- **Strict Role Boundaries**:
  - `resident`: Can search vehicles (phone masked), report incidents, send move requests, and manage vehicles registered to their own flat.
  - `security`: Can access Security Duty Mode dashboard, view active escalations, call owners directly for emergency blockages, and mark incidents resolved.
  - `admin` / `super_admin`: Access to RWA Command Center, resident user management, security guard provisioning, and full audit logs.

### 2.3 Input Sanitization & Anti-Injection
- **Zod Schema Validation**: All incoming API payloads are parsed against Zod schemas.
- **MongoDB Regex Injection Prevention**: All search queries are sanitized with `sanitizeRegexQuery()` escaping special characters (`.*+?^${}()|[\]\`) prior to constructing Mongoose queries.
- **Safe Database Error Messages**: Internal database stack traces or Mongoose errors are swallowed in production handlers and replaced with sanitized generic user error responses.

### 2.4 Abuse Prevention & Rate Limiting
In-memory sliding window rate limiters are applied across key endpoints:
- **Vehicle Search**: Capped at 10 queries per minute per IP to prevent brute-force plate enumeration or mass scraping. Max 5 results per search query.
- **Incident Creation**: Capped at 3 incident reports per 15 minutes per user to prevent notification spam.
- **Duplicate Prevention**: Anti-spam logic blocks duplicate active incidents for the same vehicle plate created within a 10-minute window.
- **Authentication**: Capped at 5 OTP requests per 10 minutes per IP.

### 2.5 Audit Logging
Sensitive actions are audited in the `auditLogs` collection:
- `VEHICLE_SEARCH`: Tracks search queries.
- `MOVE_REQUEST_SENT`: Tracks resident nudges.
- `INCIDENT_ESCALATED`: Tracks guard escalations.
- `INCIDENT_RESOLVED`: Tracks resolutions.
- `SECURITY_USER_CREATED`: Tracks guard account provisioning.
- `USER_UPDATED`: Tracks account deactivations or role updates.

---

## 3. Verification & Compliance Matrix

| Vulnerability Vector | Protection Mechanism | Verification Status |
| :--- | :--- | :--- |
| **Phone Number Leakage** | API-level phone masking (`+91 98*** **321`) | Verified |
| **IDOR / Privilege Escalation** | Middleware + `requireRole()` checks on every route | Verified |
| **MongoDB Injection** | Regex escaping & Zod payload validation | Verified |
| **Database Enumeration Dump** | Result set capped to max 5 items per query | Verified |
| **Incident Spam** | 3 reports / 15 mins rate limit + duplicate check | Verified |
| **Session Tampering** | Signed HttpOnly JWT cookies | Verified |

---
*Maintained by Adore Grand Security & Engineering Team.*
