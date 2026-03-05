// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { addSecurityHeaders as applyUltraSecurity } from "@/lib/securityHeaders";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─── CONFIGURARE ──────────────────────────────────────────────────────────────
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000; // 2 ore

const isPublicRoute = createRouteMatcher([
  "/", "/despre-noi", "/servicii(.*)", "/parteneri", "/portofoliu",
  "/blog(.*)", "/contact", "/termeni-si-conditii", "/politica-de-cookies",
  "/politica-de-confidentialitate", "/inregistrare-eveniment",
  "/sign-in(.*)", "/sign-up(.*)", "/api/health"
]);

// Adăugăm un matcher specific pentru rutele de autentificare
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)", "/dashboard(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);

// ─── RATE LIMITING (Upstash Redis) ───────────────────────────────────────────
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const publicLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(150, "1 m"), // Am crescut puțin limita publică
  prefix: "mw_public",
});

const adminLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(500, "1 m"),
  prefix: "mw_admin",
});

// ─── HELPER FUNCTIONS ─────────────────────────────────────────────────────────
function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
}

function validateCsrf(req: NextRequest): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return true;
  const host = req.headers.get("host");
  const origin = req.headers.get("origin");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// ─── MAIN MIDDLEWARE ──────────────────────────────────────────────────────────
export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;
  const now = Date.now();
  const ip = getClientIp(req);

  // 1. SECURITY: Path Traversal prevention
  if (pathname.includes("..") || pathname.includes("//")) {
    return new NextResponse("Potential attack detected", { status: 400 });
  }

  // 2. IDENTITATE
  const authObj = await auth();
  const userEmail = (authObj.sessionClaims?.email as string || "").toLowerCase();
  
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(e => e.trim().toLowerCase())
    .filter(e => e.length > 0);

  const isVerifiedAdmin = userEmail && adminEmails.includes(userEmail);
  const isAdminPath = isAdminRoute(req);
  const isAuthPath = isAuthRoute(req);

  // 3. RATE LIMITING LOGIC REPARATĂ
  // NU limităm dacă: este Admin Verificat SAU este pagină de Login/Register
  if (!isVerifiedAdmin && !isAuthPath) {
    const limiter = isAdminPath ? adminLimiter : publicLimiter;
    const { success } = await limiter.limit(ip);
    
    if (!success) {
      console.warn(`[SECURITY] Rate limit exceeded from ${ip} on ${pathname}`);
      if (isApiRoute(req)) {
        return NextResponse.json({ error: "Too many requests" }, { status: 429 });
      }
      // Mesaj mai prietenos pentru utilizatori
      return new NextResponse("Prea multe cereri. Reveniți în câteva minute.", { status: 429 });
    }
  }

  // 4. AUTORIZARE ADMIN
  if (isAdminPath) {
    if (!authObj.userId) {
      return authObj.redirectToSignIn();
    }

    if (!isVerifiedAdmin) {
      console.error(`[SECURITY] Unauthorized admin attempt: ${userEmail} from ${ip}`);
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Session Timeout Check
    const lastActive = req.cookies.get("last_admin_activity")?.value;
    if (lastActive && (now - parseInt(lastActive, 10) > SESSION_TIMEOUT)) {
      const res = NextResponse.redirect(new URL("/sign-in", req.url));
      res.cookies.delete("__session");
      res.cookies.delete("last_admin_activity");
      return res;
    }
  }

  // 5. CSRF Validation (excludem GET)
  if (!validateCsrf(req)) {
    return NextResponse.json({ error: "Invalid Origin" }, { status: 403 });
  }

  // 6. RESPONSE FINAL
  const response = NextResponse.next();

  if (isVerifiedAdmin && isAdminPath) {
    response.cookies.set("last_admin_activity", now.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_TIMEOUT / 1000,
    });
    response.headers.set("Cache-Control", "no-store, max-age=0, must-revalidate");
  }

  return applyUltraSecurity(response, {
    admin: isAdminPath,
    development: process.env.NODE_ENV === "development",
  });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};