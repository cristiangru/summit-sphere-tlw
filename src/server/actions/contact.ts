"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { contactSchema } from "@/lib/validations/contact";

// ─── Env validation la startup (fail-fast) ────────────────────────────────────
function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`[ContactForm] Missing required env variable: ${key}`);
  return val;
}

const resend = new Resend(requireEnv("RESEND_API_KEY"));
const RECAPTCHA_SECRET_KEY = requireEnv("RECAPTCHA_SECRET_KEY");
const ADMIN_EMAIL = requireEnv("ADMIN_EMAIL");

// ─── Rate limiting DISTRIBUIT cu Upstash ──────────────────────────────────────
const redis = new Redis({
  url: requireEnv("UPSTASH_REDIS_REST_URL"),
  token: requireEnv("UPSTASH_REDIS_REST_TOKEN"),
});

const contactLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "15 m"),
  analytics: true,
  prefix: "contact_form",
});

async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  try {
    const { success, reset } = await contactLimiter.limit(ip || "unknown");
    if (!success) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 1000)
      );
      return { allowed: false, retryAfterSeconds };
    }
    return { allowed: true };
  } catch (err) {
    console.error("[ContactForm] Rate limit error:", err);
    // Dacă Redis/Upstash pică, nu blocăm complet formularul
    return { allowed: true };
  }
}

// ─── IP extracție sigură din server headers (nu din client!) ──────────────────
async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown"
  );
}

// ─── reCAPTCHA verification cu timeout ───────────────────────────────────────
async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return false;

    const data = await res.json();
    // v2: data.success === true | v3: verificăm și scorul >= 0.5
    return (
      data.success === true &&
      (data.score === undefined || data.score >= 0.5)
    );
  } catch (err) {
    // AbortError (timeout) sau eroare de rețea → fail-safe: blocăm
    console.error("[ContactForm] reCAPTCHA verification error:", err);
    return false;
  }
}

// ─── Sanitizare HTML (protecție XSS în email templates) ──────────────────────
function s(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type ActionResponse =
  | { success: true; message: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// ─── Server Action ────────────────────────────────────────────────────────────
export async function submitContactForm(rawData: unknown): Promise<ActionResponse> {
  // 1. IP din server headers (nu din client – nu poate fi falsificat)
  const ip = await getClientIp();

  // 2. Rate limiting
  const rateCheck = await checkRateLimit(ip);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterSeconds ?? 900) / 60);
    return {
      success: false,
      error: `Prea multe solicitări. Te rugăm să aștepți ${minutes} minute înainte de a reîncerca.`,
    };
  }

  // 3. Validare Zod (pe server – nu ne bazăm pe validarea din client)
  const parsed = contactSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Date invalide. Te rugăm să verifici formularul.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { firstName, lastName, email, phone, message, recaptchaToken } = parsed.data;

  // 4. Verificare reCAPTCHA (cu timeout de 5s)
  const isHuman = await verifyRecaptcha(recaptchaToken);
  if (!isHuman) {
    return {
      success: false,
      error: "Verificarea reCAPTCHA a eșuat. Te rugăm să reîncerci.",
    };
  }

  // 5. Construire emailuri
  const now = new Date().toLocaleString("ro-RO", {
    timeZone: "Europe/Bucharest",
    dateStyle: "full",
    timeStyle: "short",
  });

  const adminHtml = `<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <tr>
      <td style="background:linear-gradient(135deg,#1a2f2e 0%,#2D9A8F 100%);padding:36px 40px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">🔔 Solicitare Nouă de Programare</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">${now}</p>
      </td>
    </tr>
    <tr><td style="padding:36px 40px;">
      <p style="margin:0 0 24px;color:#374151;font-size:15px;">Ai primit o nouă solicitare prin formularul de contact SummitSphere.</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr><td style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;padding:16px 20px;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Nume complet</p>
          <p style="margin:0;color:#111827;font-size:16px;font-weight:600;">${s(firstName)} ${s(lastName)}</p>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr><td style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;padding:16px 20px;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Email</p>
          <a href="mailto:${s(email)}" style="color:#2D9A8F;font-size:15px;text-decoration:none;font-weight:500;">${s(email)}</a>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr><td style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;padding:16px 20px;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Telefon</p>
          <a href="tel:${s(phone)}" style="color:#2D9A8F;font-size:15px;text-decoration:none;font-weight:500;">${s(phone)}</a>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr><td style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;padding:16px 20px;">
          <p style="margin:0 0 8px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Mesaj / Detalii eveniment</p>
          <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;white-space:pre-wrap;">${s(message)}</p>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center">
          <a href="mailto:${s(email)}?subject=Re:%20Solicitare%20programare%20SummitSphere"
             style="display:inline-block;background:linear-gradient(135deg,#2D9A8F,#1a7a70);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:600;font-size:14px;">
            ✉️ Răspunde clientului
          </a>
        </td></tr>
      </table>
    </td></tr>
    <tr>
      <td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">Email generat automat de <strong>SummitSphere</strong></p>
      </td>
    </tr>
  </table>
  </td></tr>
</table>
</body>
</html>`;

  const clientHtml = `<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <tr>
      <td style="background:linear-gradient(135deg,#1a2f2e 0%,#2D9A8F 100%);padding:40px;text-align:center;">
        <div style="width:60px;height:60px;background:rgba(255,255,255,0.15);border-radius:50%;margin:0 auto 16px;font-size:28px;line-height:60px;">✓</div>
        <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">Solicitarea ta a fost primită!</h1>
        <p style="margin:10px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Îți mulțumim că ai contactat SummitSphere</p>
      </td>
    </tr>
    <tr><td style="padding:36px 40px;">
      <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">Bună, <strong>${s(firstName)}</strong>! 👋</p>
      <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
        Am primit solicitarea ta și îți vom răspunde în cel mai scurt timp, de obicei
        <strong>în termen de 24 de ore lucrătoare</strong>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf9;border-radius:12px;margin-bottom:24px;">
        <tr><td style="padding:24px 28px;">
          <p style="margin:0 0 16px;color:#1a7a70;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;">Ce urmează?</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding-bottom:12px;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="display:inline-block;width:22px;height:22px;background:#2D9A8F;color:#fff;border-radius:50%;text-align:center;font-size:12px;line-height:22px;font-weight:700;">1</span></td>
                <td style="padding-left:10px;color:#374151;font-size:14px;line-height:1.5;">Echipa noastră îți va analiza solicitarea</td>
              </tr></table>
            </td></tr>
            <tr><td style="padding-bottom:12px;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="display:inline-block;width:22px;height:22px;background:#2D9A8F;color:#fff;border-radius:50%;text-align:center;font-size:12px;line-height:22px;font-weight:700;">2</span></td>
                <td style="padding-left:10px;color:#374151;font-size:14px;line-height:1.5;">Te vom contacta pe email sau telefon</td>
              </tr></table>
            </td></tr>
            <tr><td>
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="display:inline-block;width:22px;height:22px;background:#2D9A8F;color:#fff;border-radius:50%;text-align:center;font-size:12px;line-height:22px;font-weight:700;">3</span></td>
                <td style="padding-left:10px;color:#374151;font-size:14px;line-height:1.5;">Stabilim detaliile și programăm întâlnirea</td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;margin-bottom:28px;">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0 0 8px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Mesajul tău</p>
          <p style="margin:0;color:#374151;font-size:13px;line-height:1.6;white-space:pre-wrap;">${s(message)}</p>
        </td></tr>
      </table>
      <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
        Întrebări urgente? Scrie-ne la
        <a href="mailto:contact@summitsphere.ro" style="color:#2D9A8F;text-decoration:none;font-weight:500;">contact@summitsphere.ro</a>
      </p>
    </td></tr>
    <tr>
      <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 4px;color:#374151;font-size:13px;font-weight:600;">SummitSphere</p>
        <p style="margin:0;color:#9ca3af;font-size:12px;">Email trimis automat – te rugăm să nu răspunzi la el.</p>
      </td>
    </tr>
  </table>
  </td></tr>
</table>
</body>
</html>`;

  // 6. Trimitere în paralel cu Promise.allSettled
  const [adminResult, clientResult] = await Promise.allSettled([
    resend.emails.send({
      from: "SummitSphere <noreply@summitsphere.ro>",
      to: [ADMIN_EMAIL],
      subject: `🔔 Solicitare nouă de la ${firstName} ${lastName}`,
      html: adminHtml,
      replyTo: email,
    }),
    resend.emails.send({
      from: "SummitSphere <noreply@summitsphere.ro>",
      to: [email],
      subject: "✅ Am primit solicitarea ta – SummitSphere",
      html: clientHtml,
    }),
  ]);

  // Emailul admin e fatal; confirmarea clientului e non-fatală
  if (adminResult.status === "rejected") {
    console.error("[ContactForm] Admin email failed:", adminResult.reason);
    return {
      success: false,
      error: "A apărut o eroare la trimiterea mesajului. Te rugăm să reîncerci.",
    };
  }

  if (clientResult.status === "rejected") {
    // Non-fatal: logăm fără date personale
    console.error("[ContactForm] Client confirmation email failed:", clientResult.reason);
  }

  // Log fără date personale (GDPR-friendly)
  console.info("[ContactForm] Submission processed successfully");

  return {
    success: true,
    message: "Mulțumim! Solicitarea ta a fost trimisă cu succes. Te vom contacta în curând.",
  };
}