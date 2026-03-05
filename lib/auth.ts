// src/lib/auth.ts (FINAL - OPTIMIZED & PERFECT)
"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";
import { logAudit } from "@/lib/audit";
import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * ============================================
 * TYPES
 * ============================================
 */

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isAdmin: boolean;
  rateLimitRemaining?: number;
}

/**
 * ============================================
 * REDIS & RATE LIMITING
 * ============================================
 */

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const adminActionLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(150, "1 m"),
  prefix: "admin_limit",
});

/**
 * ============================================
 * IN-MEMORY CACHE (5 minute TTL)
 * ============================================
 * Cache admin emails to avoid env reads every request
 */

interface AdminCacheEntry {
  emails: string[];
  timestamp: number;
}

let adminCache: AdminCacheEntry | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getAdminEmails(): string[] {
  const now = Date.now();

  if (adminCache && now - adminCache.timestamp < CACHE_TTL) {
    return adminCache.emails;
  }

  const emails = env.ADMIN_EMAILS || [];
  adminCache = { emails, timestamp: now };
  return emails;
}

/**
 * ============================================
 * HELPER: Get Client IP
 * ============================================
 * Used for audit logging and security
 */

export async function getClientIP(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0] ||
    headersList.get("x-real-ip") ||
    headersList.get("cf-connecting-ip") ||
    "unknown"
  );
}

/**
 * ============================================
 * HELPER: Check Admin Rate Limit
 * ============================================
 * Quick rate limit check for server actions
 * Returns boolean for easy checking
 */

export async function checkAdminRateLimit(userId: string): Promise<boolean> {
  try {
    const { success } = await adminActionLimiter.limit(userId);
    return success;
  } catch (error) {
    console.error("[RATE-LIMIT] Redis error:", error);
    // Graceful degradation - allow if Redis fails
    return true;
  }
}

/**
 * ============================================
 * ✅ REQUIRE ADMIN (Core Function)
 * ============================================
 * 
 * 🚀 OPTIMIZATIONS:
 * - Uses sessionClaims (no extra currentUser() call)
 * - 5-minute admin email cache
 * - Fire & forget audit logging
 * - Rate limiting with remaining count
 * - Proper error handling
 * - Safe claim extraction
 */

export async function requireAdmin(): Promise<CurrentUser> {
  const { userId, sessionClaims } = await auth();
  if (!userId) redirect("/sign-in");

  const userEmail = ((sessionClaims?.email as string) || "").trim();
  
  // 1. PRIMA BARIERĂ: Verificarea în .env (Whitelist-ul tău fix)
  const adminEmails = getAdminEmails();
  const isInEnv = adminEmails.includes(userEmail);

  // 2. A DOUA BARIERĂ: Verificarea în Supabase (Baza de date)
  // Folosim createAdminClient (cel cu service_role) creat anterior
  const supabase = createAdminClient();
  const { data: adminInDb } = await supabase
    .from('admin_users')
    .select('is_admin')
    .eq('user_id', userId)
    .single();

  const isStrictAdmin = isInEnv && adminInDb?.is_admin === true;

  // Dacă una din condiții pică, accesul e interzis
  if (!isStrictAdmin) {
    const ip = await getClientIP();
    
    await logAudit({
      action: "UNAUTHORIZED_ADMIN_ACCESS",
      userId,
      userEmail,
      resource: "admin",
      details: { 
        ip, 
        reason: !isInEnv ? "Not in ENV" : "Not in Supabase DB",
        attemptedEmail: userEmail 
      },
      severity: "error",
    }).catch(console.error);

    redirect("/");
  }

  // ✅ Check rate limit
  let rateLimitRemaining = 150; // Default

  try {
    const { success, remaining, reset } = await adminActionLimiter.limit(userId);

    rateLimitRemaining = remaining;

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      throw new Error(
        `Prea multe acțiuni (150/min). Reîncearcă în ${retryAfter}s.`
      );
    }
  } catch (error) {
    // If rate limiter fails completely, log but allow
    if (error instanceof Error && error.message.includes("Prea multe")) {
      throw error; // Re-throw rate limit errors
    }
    console.error("[RATE-LIMIT] Check failed:", error);
    // Continue with default remaining count
  }

  // ✅ Extract user details safely
  const firstName = ((sessionClaims?.fname as string) || "").trim() || null;
  const lastName = ((sessionClaims?.lname as string) || "").trim() || null;

  return {
    id: userId,
    email: userEmail,
    firstName,
    lastName,
    isAdmin: true,
    rateLimitRemaining,
  };
}

/**
 * ============================================
 * GET CURRENT USER
 * ============================================
 * Get user info without admin check
 * Useful for public pages and components
 */

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return null;
  }

  // ✅ Extract email safely
  const userEmail = ((sessionClaims?.email as string) || "").trim();

  if (!userEmail) {
    return null;
  }

  // ✅ Check if admin
  const adminEmails = getAdminEmails();
  const isAdmin = adminEmails.includes(userEmail);

  // ✅ Extract details safely
  const firstName = ((sessionClaims?.fname as string) || "").trim() || null;
  const lastName = ((sessionClaims?.lname as string) || "").trim() || null;

  return {
    id: userId,
    email: userEmail,
    firstName,
    lastName,
    isAdmin,
    // Note: rateLimitRemaining not included here
    // Use requireAdmin() if you need accurate rate limit count
  };
}

/**
 * ============================================
 * IS USER ADMIN
 * ============================================
 * Quick check if current user is admin
 */

export async function isUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.isAdmin ?? false;
}

/**
 * ============================================
 * HELPER: Throw Auth Error (with audit logging)
 * ============================================
 * Useful for explicit auth failures in server actions
 */

export async function throwAuthError(
  message: string,
  userId: string,
  userEmail: string,
  severity: "info" | "warning" | "error" = "error"
): Promise<never> {
  const ip = await getClientIP();

  // 🚀 Fire & forget
  logAudit({
    action: "AUTH_ERROR",
    userId,
    userEmail,
    resource: "auth",
    resourceId: userId,
    details: { message, ip },
    severity,
  }).catch((err) => console.error("[AUDIT] Silent fail:", err));

  throw new Error(message);
}