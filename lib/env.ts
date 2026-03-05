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
    const message = `❌ Missing env vars: ${missing.join(", ")}`;
    
    if (process.env.NODE_ENV === "development") {
      throw new Error(message);
    } else {
      // În producție logăm masiv în CloudWatch ca să știi de ce nu merge
      console.error("********************************ADMIN ALERT********************************");
      console.error(message);
      console.error("Check Amplify Console -> Environment Variables");
      console.error("***************************************************************************");
    }
  }
}

// Validăm doar pe server
if (typeof window === "undefined") {
  validateEnv();
}

export const env = {
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || "",
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  ADMIN_EMAILS: (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => e.length > 0 && e.includes("@")),
  NODE_ENV: process.env.NODE_ENV || "development",
};