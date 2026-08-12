# AdorePark — Hostile Security Review & Audit Report
**Society**: Adore Grand, Sector 85, Faridabad, Haryana, India  
**Classification**: Security Assessment & Hardening Report

---

## 1. Hostile Threat Matrix & Vulnerability Verification

| Threat Vector | Severity | Hardening & Mitigation Implemented | Status |
| :--- | :--- | :--- | :--- |
| **IDOR / Privilege Escalation** | CRITICAL | Server-side `requireRole(["admin", "super_admin"])` checks enforced on all protected API routes and Middleware. | ✅ Mitigated |
| **Resident Phone Exposure** | HIGH | Phone numbers are masked (`+91 98*** ***210`) at the API layer for standard lookups. Served unmasked **only** to verified on-duty Security Guards & Admins. | ✅ Mitigated |
| **MongoDB Regex Injection** | HIGH | All search inputs sanitized via `sanitizeRegexQuery()` escaping special characters (`.*+?^${}()|[\]\`) prior to query construction. | ✅ Mitigated |
| **Vehicle Plate Enumeration** | MEDIUM | Rate-limited search API (Max 10 queries/min per IP) + max 5 result items per query set. | ✅ Mitigated |
| **Incident Spam** | MEDIUM | Incident submission rate-limited (Max 3 reports/15 mins per user) + 10-minute duplicate active incident check. | ✅ Mitigated |
| **Session Cookie Tampering** | HIGH | Session tokens signed via `jose` JWT with `HS256` and stored in `HttpOnly`, `SameSite=Lax`, `Secure` cookies. | ✅ Mitigated |
| **Credential Exposure** | CRITICAL | Plaintext passwords are NEVER stored in MongoDB or returned in client API responses. Hashed using PBKDF2 with SHA-512 (100,000 iterations). | ✅ Mitigated |

---

## 2. Serverless Rate-Limiting Strategy & Technical Limitations

### In-Memory Sliding Window Rate Limiting
AdorePark uses an in-memory sliding window rate limiter ([src/lib/rateLimit.ts](file:///c:/Users/GARV%20ANAND/Downloads/Adore%20CMS/src/lib/rateLimit.ts)) to avoid requiring a paid Redis instance (Upstash/Redis Cloud).

> [!NOTE]
> **Serverless Limitation Disclosure**:
> In Vercel serverless deployments, each warm lambdas instance maintains its own in-memory rate limit state. Under distributed multi-region scaling, in-memory rate limits apply per serverless instance rather than globally across all instances. This design tradeoff preserves a **100% zero-cost architecture** while effectively throttling brute-force single-IP attacks.

---
*Maintained by Adore Grand Security & Engineering Team.*
