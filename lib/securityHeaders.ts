// src/lib/securityHeaders.ts (ULTRA SECURE - CLERK OPTIMIZED)
import { NextResponse } from "next/server";

/**
 * ============================================
 * CORE SECURITY HEADERS
 * ============================================
 */
const CORE_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), ambient-light-sensor=(), autoplay=(), fullscreen=(), picture-in-picture=()",
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

/**
 * ============================================
 * CONTENT SECURITY POLICY (CSP)
 * ============================================
 */
const buildCSP = (): string => {
  // Permitem toate subdomeniile tale Amplify pentru a evita erorile de tip CORS la încărcarea scripturilor
  const amplifyWildcard = "https://*.amplifyapp.com";
  
  const cspParts = [
    // 1. DEFAULT
    "default-src 'self'",

    // 2. SCRIPTS - Clerk are nevoie de 'unsafe-eval' și de domeniile sale de livrare (clerk.com, clerk.accounts.dev)
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
      "https://*.clerk.accounts.dev " +
      "https://api.clerk.com " +
      `${amplifyWildcard} ` +
      "https://challenges.cloudflare.com " +
      "https://www.googletagmanager.com " +
      "https://www.google.com " +
      "https://www.gstatic.com " +
      "https://www.google-analytics.com " +
      "https://recaptcha.google.com " +
      "https://*.recaptcha.net",

    // 3. STYLES
    "style-src 'self' 'unsafe-inline' " +
      "https://fonts.googleapis.com " +
      "https://cdn.jsdelivr.net",

    // 4. IMAGES
    "img-src 'self' data: https: blob: " +
      "https://*.clerk.accounts.dev " +
      "https://img.clerk.com " +
      "https://www.googletagmanager.com " +
      "https://www.google-analytics.com " +
      "https://stats.g.doubleclick.net " +
      "https://cdn.jsdelivr.net",

    // 5. FONTS
    "font-src 'self' data: https://fonts.gstatic.com",

    // 6. CONNECTIONS (APIs/WebSockets)
    "connect-src 'self' wss: ws: " +
      "https://*.clerk.accounts.dev " +
      "https://api.clerk.com " +
      `${amplifyWildcard} ` +
      "https://*.supabase.co " +
      "https://www.google-analytics.com " +
      "https://*.google-analytics.com " +
      "https://www.googletagmanager.com " +
      "https://stats.g.doubleclick.net " +
      "https://www.google.com " +
      "https://recaptcha.google.com " +
      "https://*.recaptcha.net",

    // 7. FRAMES
    "frame-src 'self' " +
      "https://*.clerk.accounts.dev " +
      "https://challenges.cloudflare.com " +
      "https://www.google.com " +
      "https://recaptcha.google.com " +
      "https://*.recaptcha.net",

    // 8. OTHERS
    "worker-src 'self' blob: https://*.clerk.accounts.dev",
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
 * EXPORTED CONFIGURATIONS
 * ============================================
 */

export const securityHeaders = {
  ...CORE_HEADERS,
  "Content-Security-Policy": buildCSP(),
};

export const developmentSecurityHeaders = {
  ...CORE_HEADERS,
  "Content-Security-Policy": buildCSP()
    .replace("connect-src 'self'", "connect-src 'self' http://localhost:* ws://localhost:*")
    .replace("max-age=31536000", "max-age=0"),
};

export const adminSecurityHeaders = {
  ...CORE_HEADERS,
  // IMPORTANT: Am scos .replace("'unsafe-eval'", "") pentru ca Clerk sa funcționeze pe paginile de admin
  "Content-Security-Policy": buildCSP(),
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  "X-CSRF-Protection": "required",
};

/**
 * ============================================
 * APPLY SECURITY HEADERS
 * ============================================
 */

export function addSecurityHeaders(
  response: NextResponse,
  options?: { admin?: boolean; development?: boolean }
): NextResponse {
  let headers = securityHeaders;

  if (options?.admin) {
    headers = adminSecurityHeaders;
  } else if (options?.development) {
    headers = developmentSecurityHeaders;
  }

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Obscurity
  response.headers.delete("Server");
  response.headers.delete("X-Powered-By");

  return response;
}

export function getCSPForRoute(pathname: string): string {
  if (pathname.startsWith("/admin")) {
    return adminSecurityHeaders["Content-Security-Policy"];
  }
  if (process.env.NODE_ENV === "development") {
    return developmentSecurityHeaders["Content-Security-Policy"];
  }
  return securityHeaders["Content-Security-Policy"];
}