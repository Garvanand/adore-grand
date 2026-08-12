# AdorePark — Staff & Security Credential Management Guide
**Society**: Adore Grand, Sector 85, Faridabad, Haryana, India  
**Classification**: SUPER ADMIN CONFIDENTIAL

---

## 1. Initial Bootstrap Super Admin Credential

The system is bootstrapped with a single initial Super Admin account:

- **Username**: `garvanand03`
- **Role**: `super_admin`
- **Password**: Hashed using Node `crypto.pbkdf2Sync` (SHA-512 with 100,000 iterations).

> [!IMPORTANT]
> The plaintext password is never stored in MongoDB or returned in any client API responses. The initial password is used strictly for first-time bootstrap login.

---

## 2. Staff Credential Provisioning System

Super Admin can generate cryptographically random credentials for Security Officers and RWA Administrators directly from the RWA Command Center or via API:

`POST /api/admin/credentials`

### Generated Account Architecture
- **Cryptographic Randomness**: Passwords contain uppercase, lowercase, numbers, and symbols (`16 characters` minimum) generated via Node.js `crypto.randomBytes()`.
- **Security Guard Usernames**: `AG-Guard-XXXX`
- **RWA Admin Usernames**: `AG-Admin-XXXX`

---

## 3. One-Time Secure Export Procedure

1. Log in as Super Admin (`garvanand03`).
2. Navigate to **RWA Command Center** $\rightarrow$ **Staff Credentials**.
3. Trigger `[ Generate & Export Initial Staff Credentials ]`.
4. The system outputs a one-time credential sheet formatted:

```text
INITIAL CREDENTIAL EXPORT — SUPER ADMIN CONFIDENTIAL
--------------------------------------------------
ROLE       | USERNAME       | TEMPORARY PASSWORD | DUTY PHONE
--------------------------------------------------
Security   | AG-Guard-8F12  | vT9!pL4#Qm7@zR2$  | +91 9800099001
Security   | AG-Guard-3B94  | aK5#xN8@wP2$mL9!  | +91 9800099002
Admin      | AG-Admin-7E55  | qW1$zR9#mP4@kL2!  | +91 9800088001
--------------------------------------------------
```

5. Distribute the temporary credentials to Gate 1 security guards and administrators in person.
6. Raw passwords are purged from server RAM immediately after export. Only salted password hashes remain in the database.

---
*Maintained by Adore Grand Security & RWA Administration.*
