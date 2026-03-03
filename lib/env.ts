/**
 * Validate all required environment variables are set
 * Runs on startup and throws error if missing
 */

const requiredEnvVars = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_EMAILS",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

function validateEnv() {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    const errorMsg = `❌ Missing environment variables: ${missing.join(", ")}\n\n` +
        `Please add them to your .env.local file or production environment.\n`;
    
    // În development aruncăm o eroare vizibilă, în producție logăm critic
    if (process.env.NODE_ENV === "development") {
      throw new Error(errorMsg);
    } else {
      console.error(errorMsg);
    }
  }
}

// Validate on import (only server-side)
if (typeof window === "undefined") {
  validateEnv();
}

export const env = {
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  // Redis (Rate Limiting)
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL!,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN!,

  // Admin
  // Transformă string-ul "email1, email2" într-un array curat ['email1', 'email2']
  ADMIN_EMAILS: (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase()) // Forțăm lowercase pentru comparații sigure
    .filter((e) => e.length > 0),

  // App
  NODE_ENV: process.env.NODE_ENV || "development",
};

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";