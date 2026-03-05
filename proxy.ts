// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { addSecurityHeaders as applyUltraSecurity } from "@/lib/securityHeaders";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─── SESSION TIMEOUT (2 ore) ──────────────────────────────────────────────────
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;

// ─── ROUTE MATCHERS ───────────────────────────────────────────────────────────
const isPublicRoute = createRouteMatcher([
  "/",
  "/despre-noi",
  "/servicii(.*)",
  "/parteneri",
  "/portofoliu",
  "/blog(.*)",
  "/contact",
  "/termeni-si-conditii",
  "/politica-de-cookies",
  "/politica-de-confidentialitate",
  "/inregistrare-eveniment",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/health",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/dashboard(.*)"]);
const isApiRoute = createRouteMatcher(["/api(.*)"]);

// ─── RATE LIMITING cu Upstash Redis (funcționează pe Vercel/serverless) ───────
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const publicLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  prefix: "mw_public",
});

const adminLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(200, "1 m"),
  prefix: "mw_admin",
});

// ─── SESSION TIMEOUT CHECK ────────────────────────────────────────────────────
function checkSessionTimeout(lastActive: string | undefined, now: number): boolean {
  if (!lastActive) return true;
  return now - parseInt(lastActive, 10) <= SESSION_TIMEOUT;
}

// ─── CSRF VALIDATION ──────────────────────────────────────────────────────────
function validateCsrf(req: NextRequest): boolean {
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) return true;

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
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  // SECURITY 1: Path Traversal
  if (pathname.includes("..") || pathname.includes("//")) {
    console.warn(`[SECURITY] Path traversal attempt from ${ip}: ${pathname}`);
    return new NextResponse("Blocked", { status: 400 });
  }

  const isAdmin = isAdminRoute(req);
  const isPublic = isPublicRoute(req);
  const isApi = isApiRoute(req);

  // SECURITY 2: Rate Limiting distribuită (Redis — funcționează pe orice instanță)
  const limiter = isAdmin ? adminLimiter : publicLimiter;
  const { success: withinLimit } = await limiter.limit(ip);
  if (!withinLimit) {
    console.warn(`[SECURITY] Rate limit exceeded from ${ip}`);
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // ROUTE 1: Public — ieșire rapidă
  if (isPublic) {
    const res = NextResponse.next();
    return applyUltraSecurity(res, {
      development: process.env.NODE_ENV === "development",
    });
  }

  // ROUTE 2: Autentificare
  const authObj = await auth();
  const userId = authObj.userId;

  if (!userId) {
    if (isApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return authObj.redirectToSignIn();
  }

  // SECURITY 3: Verificare admin + session timeout
  if (isAdmin) {
    const userEmail = (authObj.sessionClaims?.email as string || "").toLowerCase();

    // ✅ Parsing consistent cu env.ts (trim + lowercase)
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map(e => e.trim().toLowerCase())
      .filter(e => e.length > 0);

    if (!userEmail || !adminEmails.includes(userEmail)) {
      console.warn(`[SECURITY] Unauthorized admin access: ${userEmail || "unknown"} from ${ip}`);
      return NextResponse.redirect(new URL("/", req.url));
    }

    const lastActive = req.cookies.get("last_admin_activity")?.value;
    if (!checkSessionTimeout(lastActive, now)) {
      console.warn(`[SECURITY] Session timeout for ${userId} from ${ip}`);
      const res = NextResponse.redirect(new URL("/sign-in", req.url));
      res.cookies.delete("__session");
      res.cookies.delete("last_admin_activity");
      return res;
    }
  }

  // SECURITY 4: CSRF
  if (!validateCsrf(req)) {
    console.warn(`[SECURITY] CSRF detected from ${ip}`);
    return NextResponse.json({ error: "CSRF Detected" }, { status: 403 });
  }

  // RESPONSE FINAL
  const response = NextResponse.next();

  if (isAdmin) {
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
    admin: isAdmin,
    development: process.env.NODE_ENV === "development",
  });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};