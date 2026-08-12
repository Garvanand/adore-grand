/**
 * ADOREPARK ENVIRONMENT VALIDATION & FAIL-SAFE LAYER
 * Enforces production security constraints, zero-cost feature flags, and secrets verification.
 */

export interface EnvConfig {
  nodeEnv: string;
  isProduction: boolean;
  devAuthMode: boolean;
  smsEnabled: boolean;
  mongodbUri: string;
  authSecret: string;
  appUrl: string;
  vapidPublicKey: string;
  vapidPrivateKey: string;
}

export function validateEnvironment(): EnvConfig {
  const nodeEnv = process.env.NODE_ENV || "development";
  const isProduction = nodeEnv === "production";
  const devAuthMode = process.env.DEV_AUTH_MODE === "true";
  const smsEnabled = process.env.SMS_ENABLED === "true"; // Defaults to false (Zero-cost rule)

  // 1. FAIL-SAFE SECURITY CHECK: Dev Auth Mode MUST NEVER run in production
  if (isProduction && devAuthMode) {
    const errorMsg =
      "[SECURITY FATAL] DEV_AUTH_MODE=true is strictly prohibited in NODE_ENV=production. Production authentication must use real OTP verification.";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // 2. Production Secret Verification
  if (isProduction) {
    const requiredSecrets = [
      "MONGODB_URI",
      "AUTH_SECRET",
      "VAPID_PUBLIC_KEY",
      "VAPID_PRIVATE_KEY",
    ];

    const missing = requiredSecrets.filter((secret) => !process.env[secret]);
    if (missing.length > 0) {
      const missingMsg = `[CONFIG FATAL] Missing required production environment variables: ${missing.join(", ")}`;
      console.error(missingMsg);
      throw new Error(missingMsg);
    }
  }

  return {
    nodeEnv,
    isProduction,
    devAuthMode: isProduction ? false : devAuthMode,
    smsEnabled,
    mongodbUri: process.env.MONGODB_URI || "",
    authSecret: process.env.AUTH_SECRET || "fallback_dev_secret_change_in_prod",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
    vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || "",
  };
}

export function isDevAuthAllowed(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.DEV_AUTH_MODE !== "false";
}
