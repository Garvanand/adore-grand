/**
 * Multi-Category Sliding Window Rate Limiter for AdorePark
 * Protects against brute-force vehicle plate enumeration, incident spam, and mass extraction.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStores = new Map<string, Map<string, RateLimitRecord>>();

function getCategoryStore(category: string): Map<string, RateLimitRecord> {
  if (!rateLimitStores.has(category)) {
    rateLimitStores.set(category, new Map());
  }
  return rateLimitStores.get(category)!;
}

/**
 * Check sliding window rate limit for a specific category and IP/user identifier
 */
export function checkRateLimit(
  category: "auth" | "search" | "incident" | "notification",
  identifier: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetMs: number } {
  const store = getCategoryStore(category);
  const now = Date.now();
  const record = store.get(identifier) || { timestamps: [] };

  // Filter timestamps within current window
  const validTimestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (validTimestamps.length >= maxRequests) {
    const oldestTimestamp = validTimestamps[0];
    const resetMs = windowMs - (now - oldestTimestamp);
    return { allowed: false, remaining: 0, resetMs };
  }

  validTimestamps.push(now);
  store.set(identifier, { timestamps: validTimestamps });

  return {
    allowed: true,
    remaining: maxRequests - validTimestamps.length,
    resetMs: windowMs,
  };
}

/**
 * Escape regex special characters to prevent MongoDB regex injection attacks
 */
export function sanitizeRegexQuery(query: string): string {
  if (!query) return "";
  return query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
