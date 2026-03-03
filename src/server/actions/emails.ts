"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ─── Env validation la startup (fail-fast) ────────────────────────────────────
function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`[Emails] Missing required env variable: ${key}`);
  return val;
}

const resend = new Resend(requireEnv("RESEND_API_KEY"));
const ADMIN_EMAIL = requireEnv("ADMIN_EMAIL");
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "noreply@summitsphere.ro";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

// ─── Rate limiting DISTRIBUIT cu Upstash ──────────────────────────────────────
const redis = new Redis({
  url: requireEnv("UPSTASH_REDIS_REST_URL"),
  token: requireEnv("UPSTASH_REDIS_REST_TOKEN"),
});

const emailsLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  analytics: true,
  prefix: "emails",
});

async function checkRateLimit(
  ip: string
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  try {
    const { success, reset } = await emailsLimiter.limit(ip || "unknown");
    if (!success) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 1000)
      );
      return { allowed: false, retryAfterSeconds };
    }
    return { allowed: true };
  } catch (err) {
    console.error("[Emails] Rate limit error:", err);
    // Dacă Redis/Upstash pică, nu blocăm complet flow-ul de business
    return { allowed: true };
  }
}

// ─── IP extracție sigură din server headers ───────────────────────────────────
async function getClientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
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

// ─── Format dată în română ────────────────────────────────────────────────────
function formatDateRo(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      timeZone: "Europe/Bucharest",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return s(dateString);
  }
}

// ─── Validare Zod ─────────────────────────────────────────────────────────────
const participationSchema = z.object({
  participantName: z.string().min(2).max(100),
  participantEmail: z.string().email().max(150),
  eventTitle: z.string().min(1).max(200),
  eventDate: z.string().min(1),
  eventLocation: z.string().min(1).max(200),
  eventId: z.string().min(1).max(100),
  adminEmail: z.string().email().optional(),
  tipParticipant: z.enum(["Fizica", "Juridica"]),
});

type ParticipationData = z.infer<typeof participationSchema>;

// ─── Types ────────────────────────────────────────────────────────────────────
export type EmailActionResponse =
  | { success: true; adminEmailId: string; clientEmailId?: string }
  | { success: false; error: string };

// ─── Server Action ────────────────────────────────────────────────────────────
export async function sendParticipationEmails(
  rawData: unknown
): Promise<EmailActionResponse> {
  // 1. IP din server headers (nu din client)
  const ip = await getClientIp();

  // 2. Rate limiting
  const rateCheck = await checkRateLimit(ip);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterSeconds ?? 900) / 60);
    console.warn("[Emails] Rate limit hit");
    return { success: false, error: `Prea multe cereri. Reîncercă în ${minutes} minute.` };
  }

  // 3. Validare Zod pe server
  const parsed = participationSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: "Date invalide. Verifică câmpurile formularului." };
  }

  const data: ParticipationData = parsed.data;
  const targetAdminEmail = data.adminEmail ?? ADMIN_EMAIL;
  const now = new Date().toLocaleString("ro-RO", {
    timeZone: "Europe/Bucharest",
    dateStyle: "full",
    timeStyle: "short",
  });

  // ─── Email Admin HTML ──────────────────────────────────────────────────────
  const adminHtml = `<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:40px 0;">
  <tr><td align="center">
  <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <tr>
      <td style="background:linear-gradient(135deg,#1a2f2e 0%,#2D9A8F 100%);padding:36px 40px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">🔔 Nouă Înscricare la Eveniment</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">${now}</p>
      </td>
    </tr>

    <tr><td style="padding:36px 40px;">
      <p style="margin:0 0 24px;color:#374151;font-size:15px;">Un nou participant s-a înscris la evenimentul tău prin SummitSphere.</p>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr><td style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;padding:16px 20px;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Participant</p>
          <p style="margin:0;color:#111827;font-size:16px;font-weight:600;">${s(data.participantName)}</p>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr><td style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;padding:16px 20px;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Email</p>
          <a href="mailto:${s(data.participantEmail)}" style="color:#2D9A8F;font-size:15px;text-decoration:none;font-weight:500;">${s(data.participantEmail)}</a>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr><td style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;padding:16px 20px;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Tip Participant</p>
          <p style="margin:0;color:#111827;font-size:15px;font-weight:500;">${data.tipParticipant === "Fizica" ? "👤 Persoană Fizică" : "🏢 Persoană Juridică"}</p>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr><td style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;padding:16px 20px;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Eveniment</p>
          <p style="margin:0;color:#111827;font-size:15px;font-weight:600;">${s(data.eventTitle)}</p>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr><td style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;padding:16px 20px;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Data Evenimentului</p>
          <p style="margin:0;color:#111827;font-size:15px;font-weight:500;">📅 ${formatDateRo(data.eventDate)}</p>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
        <tr><td style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;padding:16px 20px;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Locație</p>
          <p style="margin:0;color:#111827;font-size:15px;font-weight:500;">📍 ${s(data.eventLocation)}</p>
        </td></tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:8px;">
            <a href="mailto:${s(data.participantEmail)}?subject=Re:%20Inscriere%20${encodeURIComponent(data.eventTitle)}"
               style="display:block;background:linear-gradient(135deg,#2D9A8F,#1a7a70);color:#fff;text-decoration:none;padding:14px 20px;border-radius:10px;font-weight:600;font-size:14px;text-align:center;">
              ✉️ Răspunde participantului
            </a>
          </td>
          <td style="padding-left:8px;">
            <a href="${BASE_URL}/admin/participants?event=${s(data.eventId)}"
               style="display:block;background:#1e293b;color:#fff;text-decoration:none;padding:14px 20px;border-radius:10px;font-weight:600;font-size:14px;text-align:center;">
              📊 Vezi participanți
            </a>
          </td>
        </tr>
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

  // ─── Email Client (confirmare) ─────────────────────────────────────────────
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
        <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">Înscrierea ta a fost confirmată!</h1>
        <p style="margin:10px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Îți mulțumim că te-ai înscris la SummitSphere</p>
      </td>
    </tr>

    <tr><td style="padding:36px 40px;">
      <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6;">Bună, <strong>${s(data.participantName)}</strong>! 👋</p>
      <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
        Înscrierea ta la <strong>${s(data.eventTitle)}</strong> a fost înregistrată cu succes.
        Suntem entuziaști că vei fi alături de noi!
      </p>

      <!-- Detalii eveniment -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="background:#f8fafc;border-radius:10px;border-left:4px solid #2D9A8F;padding:16px 20px;">
          <p style="margin:0 0 12px;color:#6b7280;font-size:11px;text-transform:uppercase;letter-spacing:.8px;font-weight:600;">Detalii Eveniment</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding-bottom:8px;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:24px;color:#2D9A8F;font-size:16px;">📅</td>
                <td style="padding-left:8px;">
                  <span style="color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Data</span><br/>
                  <span style="color:#111827;font-size:14px;font-weight:500;">${formatDateRo(data.eventDate)}</span>
                </td>
              </tr></table>
            </td></tr>
            <tr><td style="padding-bottom:8px;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:24px;color:#2D9A8F;font-size:16px;">📍</td>
                <td style="padding-left:8px;">
                  <span style="color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Locație</span><br/>
                  <span style="color:#111827;font-size:14px;font-weight:500;">${s(data.eventLocation)}</span>
                </td>
              </tr></table>
            </td></tr>
            <tr><td>
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:24px;color:#2D9A8F;font-size:16px;">🎯</td>
                <td style="padding-left:8px;">
                  <span style="color:#6b7280;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;">Tip participare</span><br/>
                  <span style="color:#111827;font-size:14px;font-weight:500;">${data.tipParticipant === "Fizica" ? "Persoană Fizică" : "Persoană Juridică"}</span>
                </td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>
      </table>

      <!-- Ce urmează -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf9;border-radius:12px;margin-bottom:24px;">
        <tr><td style="padding:24px 28px;">
          <p style="margin:0 0 16px;color:#1a7a70;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;">Ce urmează?</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding-bottom:14px;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="display:inline-block;width:22px;height:22px;background:#2D9A8F;color:#fff;border-radius:50%;text-align:center;font-size:12px;line-height:22px;font-weight:700;">1</span></td>
                <td style="padding-left:10px;">
                  <span style="color:#111827;font-size:14px;font-weight:600;">Confirmare finală</span><br/>
                  <span style="color:#6b7280;font-size:13px;line-height:1.4;">Vei primi detaliile finale cu 48 de ore înainte de eveniment.</span>
                </td>
              </tr></table>
            </td></tr>
            <tr><td style="padding-bottom:14px;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="display:inline-block;width:22px;height:22px;background:#2D9A8F;color:#fff;border-radius:50%;text-align:center;font-size:12px;line-height:22px;font-weight:700;">2</span></td>
                <td style="padding-left:10px;">
                  <span style="color:#111827;font-size:14px;font-weight:600;">Factură și plată</span><br/>
                  <span style="color:#6b7280;font-size:13px;line-height:1.4;">Vom reveni cu factura și detaliile de plată în cel mai scurt timp.</span>
                </td>
              </tr></table>
            </td></tr>
            <tr><td style="padding-bottom:14px;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="display:inline-block;width:22px;height:22px;background:#2D9A8F;color:#fff;border-radius:50%;text-align:center;font-size:12px;line-height:22px;font-weight:700;">3</span></td>
                <td style="padding-left:10px;">
                  <span style="color:#111827;font-size:14px;font-weight:600;">Pregătire</span><br/>
                  <span style="color:#6b7280;font-size:13px;line-height:1.4;">Verifică materialele și informațiile trimise cu o zi înainte.</span>
                </td>
              </tr></table>
            </td></tr>
            <tr><td>
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="width:28px;vertical-align:top;"><span style="display:inline-block;width:22px;height:22px;background:#2D9A8F;color:#fff;border-radius:50%;text-align:center;font-size:12px;line-height:22px;font-weight:700;">4</span></td>
                <td style="padding-left:10px;">
                  <span style="color:#111827;font-size:14px;font-weight:600;">Eveniment</span><br/>
                  <span style="color:#6b7280;font-size:13px;line-height:1.4;">Prezintă-te cu ID-ul de participant și bucură-te de experiență!</span>
                </td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>
      </table>

      <!-- Warning spam -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
        <tr><td style="background:#fffbeb;border-left:4px solid #f59e0b;border-radius:10px;padding:16px 20px;">
          <p style="margin:0;color:#92400e;font-size:13px;line-height:1.5;">
            <strong>⚠️ Important:</strong> Dacă nu primești emailurile de confirmare, verifică folderul <strong>Spam</strong>.
            Adaugă <strong>${s(FROM_EMAIL)}</strong> la contactele tale.
          </p>
        </td></tr>
      </table>

      <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
        Ai întrebări? Ne poți contacta oricând la
        <a href="mailto:contact@summitsphere.ro" style="color:#2D9A8F;text-decoration:none;font-weight:500;">contact@summitsphere.ro</a>
      </p>
    </td></tr>

    <tr>
      <td style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
        <p style="margin:0 0 4px;color:#374151;font-size:13px;font-weight:600;">SummitSphere</p>
        <p style="margin:0;color:#9ca3af;font-size:12px;">© 2025 SummitSphere. Toate drepturile rezervate. Email trimis automat – te rugăm să nu răspunzi la el.</p>
      </td>
    </tr>

  </table>
  </td></tr>
</table>
</body>
</html>`;

  // 4. Trimitere în paralel cu Promise.allSettled
  // allSettled (nu all!) — dacă confirmarea clientului pică, nu blocăm flow-ul
  const [adminResult, clientResult] = await Promise.allSettled([
    resend.emails.send({
      from: `SummitSphere <${FROM_EMAIL}>`,
      to: [targetAdminEmail],
      subject: `🔔 Nouă înscricare: ${data.participantName} la ${data.eventTitle}`,
      html: adminHtml,
      replyTo: data.participantEmail,
    }),
    resend.emails.send({
      from: `SummitSphere <${FROM_EMAIL}>`,
      to: [data.participantEmail],
      subject: `✅ Înscricare confirmată la ${data.eventTitle}`,
      html: clientHtml,
    }),
  ]);

  // Emailul admin e fatal
  if (adminResult.status === "rejected") {
    console.error("[Emails] Admin email failed:", adminResult.reason);
    return { success: false, error: "Eroare la trimiterea notificării. Reîncercă." };
  }

  // Eroare Resend (e.g. domeniu neverificat) — distinc de rejected
  if (adminResult.value.error) {
    console.error("[Emails] Admin email Resend error:", adminResult.value.error);
    return { success: false, error: "Eroare la trimiterea notificării. Reîncercă." };
  }

  // Confirmarea clientului e non-fatală
  if (clientResult.status === "rejected") {
    console.error("[Emails] Client confirmation email failed:", clientResult.reason);
  } else if (clientResult.value.error) {
    console.error("[Emails] Client email Resend error:", clientResult.value.error);
  }

  // Log fără date personale (GDPR-friendly)
  console.info("[Emails] Participation emails processed successfully");

  return {
    success: true,
    adminEmailId: adminResult.value.data?.id ?? "",
    clientEmailId:
      clientResult.status === "fulfilled" && !clientResult.value.error
        ? (clientResult.value.data?.id ?? undefined)
        : undefined,
  };
}