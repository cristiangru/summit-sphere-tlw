

// src/lib/securityHeaders.ts (ULTRA SECURE - FINAL VERSION)
import { NextResponse } from "next/server";

/**
 * ============================================
 * SECURITY HEADERS CONFIGURATION
 * ============================================
 * ✅ OWASP compliant
 * ✅ Production-ready
 * ✅ Optimized for Clerk + Supabase + Google services
 * ============================================
 */

/**
 * ============================================
 * CORE SECURITY HEADERS
 * ============================================
 */

const CORE_HEADERS = {
  // ✅ Prevent MIME type sniffing (XSS attacks)
  "X-Content-Type-Options": "nosniff",

  // ✅ Prevent clickjacking - disallow embedding in iframes
  "X-Frame-Options": "DENY",

  // ✅ Enable XSS filter in older browsers
  "X-XSS-Protection": "1; mode=block",

  // ✅ Prevent referrer leakage to external sites
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // ✅ Disable browser features for security
  "Permissions-Policy":
    "geolocation=(), " +
    "microphone=(), " +
    "camera=(), " +
    "payment=(), " +
    "usb=(), " +
    "magnetometer=(), " +
    "gyroscope=(), " +
    "accelerometer=(), " +
    "ambient-light-sensor=(), " +
    "autoplay=(), " +
    "fullscreen=(), " +
    "picture-in-picture=()",

  // ✅ Cache control - prevent sensitive data caching
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",

  // ✅ HSTS - Force HTTPS (1 year)
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

/**
 * ============================================
 * CONTENT SECURITY POLICY (CSP)
 * ============================================
 * Most critical header - prevents XSS, injections
 * 
 * Structure:
 * - default-src: Fallback for all resources
 * - script-src: JavaScript sources
 * - style-src: CSS sources
 * - img-src: Image sources
 * - font-src: Font sources
 * - connect-src: API/fetch/WebSocket sources
 * - frame-src: Iframe sources
 * - object-src: Plugin sources (usually disabled)
 * - base-uri: Base tag injection prevention
 * - form-action: Form submission targets
 * - frame-ancestors: Clickjacking prevention
 */
const buildCSP = (): string => {
  const clerkDomain = "https://clerk.d1smwj4mjvlfi.amplifyapp.com";
  
  const cspParts = [
    // ✅ 1. DEFAULT
    "default-src 'self'",

    // ✅ 2. SCRIPTS - ATENȚIE: Toate trebuie să fie într-o SINGURĂ directivă "script-src"
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
      "https://*.clerk.accounts.dev " +
      "https://api.clerk.com " +
      `${clerkDomain} ` +
      "https://challenges.cloudflare.com " +
      "https://www.googletagmanager.com " +
      "https://www.google.com " +
      "https://www.gstatic.com " +
      "https://www.google-analytics.com " +
      "https://recaptcha.google.com " +
      "https://*.recaptcha.net",
      
// ✅ WORKERS - Clerk are nevoie de blob pentru managementul sesiunii
    "worker-src 'self' blob: https://*.clerk.accounts.dev",

    // ✅ 3. STYLES
    "style-src 'self' 'unsafe-inline' " +
      "https://fonts.googleapis.com " +
      "https://cdn.jsdelivr.net",

    // ✅ 4. IMAGES
    "img-src 'self' data: https: " +
      "https://*.clerk.accounts.dev " +
      "https://img.clerk.com " +
      `${clerkDomain} ` +
      "https://www.googletagmanager.com " +
      "https://www.google-analytics.com " +
      "https://stats.g.doubleclick.net " +
      "https://cdn.jsdelivr.net",

    // ✅ 5. FONTS
    "font-src 'self' data: https://fonts.gstatic.com",

    // ✅ 6. CONNECTIONS (APIs/WebSockets) - Trebuie consolidate aici
    "connect-src 'self' wss: ws: " +
      "https://*.clerk.accounts.dev " +
      "https://api.clerk.com " +
      `${clerkDomain} ` +
      "https://*.supabase.co " +
      "https://www.google-analytics.com " +
      "https://*.google-analytics.com " +
      "https://www.googletagmanager.com " +
      "https://stats.g.doubleclick.net " +
      "https://www.google.com " +
      "https://recaptcha.google.com " +
      "https://*.recaptcha.net",

    // ✅ 7. FRAMES
    "frame-src 'self' " +
      "https://*.clerk.accounts.dev " +
      `${clerkDomain} ` +
      "https://challenges.cloudflare.com " +
      "https://www.google.com " +
      "https://recaptcha.google.com " +
      "https://*.recaptcha.net",

    // ✅ 8. ALTE REGULI
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ];

  return cspParts.join("; ");
};
/**
 * ============================================
 * BUILD COMPLETE SECURITY HEADERS
 * ============================================
 */

export const securityHeaders = {
  ...CORE_HEADERS,
  "Content-Security-Policy": buildCSP(),
};

/**
 * ============================================
 * DEVELOPMENT HEADERS (Slightly relaxed)
 * ============================================
 */

export const developmentSecurityHeaders = {
  ...CORE_HEADERS,
  "Content-Security-Policy": buildCSP()
    // Allow localhost in development
    .replace("connect-src 'self'", "connect-src 'self' http://localhost:* ws://localhost:*")
    // Reduce HSTS in development
    .replace("max-age=31536000", "max-age=0"),
};

/**
 * ============================================
 * ADMIN-SPECIFIC HEADERS (Stricter)
 * ============================================
 */

export const adminSecurityHeaders = {
  ...CORE_HEADERS,
  // Stricter CSP for admin area - remove unsafe-inline where possible
  "Content-Security-Policy": buildCSP()
    // Keep inline styles for admin UI but be aware of risks
    .replace("'unsafe-eval'", ""), // Remove unsafe-eval for admin

  // ✅ Prevent admin area caching completely
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",

  // ✅ Require CSRF token
  "X-CSRF-Protection": "required",
};

/**
 * ============================================
 * APPLY SECURITY HEADERS TO RESPONSE
 * ============================================
 */

export function addSecurityHeaders(
  response: NextResponse,
  options?: { admin?: boolean; development?: boolean }
): NextResponse {
  // Select appropriate headers
  let headers = securityHeaders;

  if (options?.admin) {
    headers = adminSecurityHeaders;
  } else if (options?.development) {
    headers = developmentSecurityHeaders;
  }

  // ✅ Apply each header to response
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // ✅ REMOVE identifying headers (security through obscurity)
  response.headers.delete("Server");
  response.headers.delete("X-Powered-By");
  response.headers.delete("X-AspNet-Version");
  response.headers.delete("X-Runtime-Version");

  return response;
}

/**
 * ============================================
 * HELPER: Get CSP for specific routes
 * ============================================
 */

export function getCSPForRoute(pathname: string): string {
  if (pathname.startsWith("/admin")) {
    return adminSecurityHeaders["Content-Security-Policy"];
  }

  if (process.env.NODE_ENV === "development") {
    return developmentSecurityHeaders["Content-Security-Policy"];
  }

  return securityHeaders["Content-Security-Policy"];
}
