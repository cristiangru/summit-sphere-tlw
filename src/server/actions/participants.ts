// src/server/actions/participants.ts (OPTIMIZED + SECURE)
"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { participantRegistrationSchema } from "@/lib/validations/index";
import { logAudit } from "@/lib/audit";
import { requireAdmin, checkAdminRateLimit, getClientIP } from "@/lib/auth";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { notifyAdminNewRegistration } from "@/src/server/actions/notifications";
import { sendParticipationEmails } from "./emails";

// ============================================
// SCHEMAS
// ============================================

const deleteParticipantSchema = z.object({
  participantId: z.string().uuid("ID participant invalid"),
  eventId: z.string().uuid("ID eveniment invalid"),
});

const updateStatusSchema = z.object({
  participantId: z.string().uuid("ID participant invalid"),
  newStatus: z.enum(["pending", "confirmed", "attended", "no-show", "cancelled"]),
  reason: z.string().max(500).optional(),
});

// ============================================
// SERVICE CLIENT CACHE (Singleton)
// ============================================
// ✅ Create once per server instance
// ✅ Reuse across all requests
// ✅ Faster: No recreation overhead

let cachedServiceClient: SupabaseClient | null = null;

function getServiceClient(): SupabaseClient {
  if (!cachedServiceClient) {
    cachedServiceClient = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );
  }
  return cachedServiceClient;
}

// ============================================
// REDIS + RATE LIMITING
// ============================================

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const registrationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  prefix: "registration",
});

// ============================================
// FETCH PARTICIPANTS (Cached)
// ============================================
// ✅ Cached query
// ✅ Service client reused
// ✅ 1 minute cache with background revalidation

async function fetchParticipants(
  eventId: string,
  page: number = 1,
  pageSize: number = 500
) {
  "use cache";

  const { cacheTag, cacheLife } = await import("next/cache");

  // ✅ Tag generic + tag specific per event
  cacheTag("participants");
  if (eventId) {
    cacheTag(`participants-${eventId}`);
  }
  cacheLife("minutes"); // 1 minute default

  const supabase = getServiceClient();

  // ✅ Validate pagination
  const safePage =
    Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const safePageSize = Math.min(
    Math.max(Math.floor(pageSize) || 100, 50),
    500
  );

  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  let query = supabase
    .from("participants")
    .select(
      "*, event:events(title, price, currency, location)",
      {
        count: "exact",
      }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (eventId && typeof eventId === "string") {
    query = query.eq("event_id", eventId);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(`Participants fetch failed: ${error.message}`);
  }

  return {
    data: data ?? [],
    total: count ?? data?.length ?? 0,
    page: safePage,
    pageSize: safePageSize,
  };
}

// ============================================
// GET PARTICIPANTS (Admin)
// ============================================

export async function getParticipants(
  eventId: string = "",
  pageParam: number = 1
) {
  await requireAdmin();

  try {
    const {
      data,
      total,
      page: currentPage,
      pageSize,
    } = await fetchParticipants(eventId.trim(), pageParam);

    return {
      success: true,
      participants: data,
      total,
      page: currentPage,
      pageSize,
    };
  } catch (error: any) {
    console.error("[ERROR] getParticipants:", error);
    return { success: false, error: error.message || "Acces interzis" };
  }
}

// ============================================
// SUBMIT REGISTRATION (Public)
// ============================================

interface EventData {
  title: string;
  start_date: string;
  end_date?: string;
  location: string;
}

export async function submitParticipantRegistration(formData: unknown) {
  try {
    const ip = await getClientIP();

    // ✅ Rate limiting check
    const { success, limit, reset } = await registrationLimiter.limit(ip);
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return {
        success: false,
        error: `Prea multe încercări. Reîncearcă în ${retryAfter}s. Limita: ${limit}/min`,
      };
    }

    // ✅ Validate input
    const validated = participantRegistrationSchema.parse(formData);

    if (!validated.recaptchaToken) {
      return { success: false, error: "reCAPTCHA obligatoriu" };
    }

    // ✅ Verify reCAPTCHA
    const recaptchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${validated.recaptchaToken}`,
      }
    );

    const recaptchaData = await recaptchaRes.json();
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return { success: false, error: "Verificare bot eșuată" };
    }

    const supabase = await createClient();

    // ✅ Check for duplicate
    const { data: existing } = await supabase
      .from("participants")
      .select("id")
      .eq("event_id", validated.eventId)
      .eq("email", validated.email.toLowerCase())
      .maybeSingle();

    if (existing) {
      return { success: false, error: "Email deja înregistrat" };
    }

    // ✅ FETCH EVENT DATA FIRST (before insert)
    const { data: eventDataRaw, error: eventError } = await supabase
      .from("events")
      .select("id, title, start_date, end_date, location")
      .eq("id", validated.eventId)
      .single();

    if (eventError || !eventDataRaw) {
      return { success: false, error: "Evenimentul nu a fost găsit" };
    }

    const eventData = eventDataRaw as EventData;

    // ✅ Build participant data
    const insertData: Record<string, any> = {
      event_id: validated.eventId,
      gender: validated.gender,
      nume: validated.nume.trim(),
      prenume: validated.prenume.trim(),
      email: validated.email.toLowerCase().trim(),
      telefon: validated.telefon?.trim() || null,
      specializare:
        validated.specializare === "Altă Specializare"
          ? validated.specializare_custom?.trim() || "Altă Specializare"
          : validated.specializare.trim(),
      tip_participant: validated.tipParticipant,
      status: "pending",
      source: "form",
      politica_confidentialitate: validated.politica_confidentialitate,
      termeni_conditii: validated.termeni_conditii,
      marketing_consent: validated.marketing_consent,
      acord_foto_video: validated.acord_foto_video || false,
      informare_natura_eveniment: validated.informare_natura_eveniment || false,
    };

    // ✅ Add Fizica-specific fields
    if (validated.tipParticipant === "Fizica") {
      insertData.cnp = validated.cnp?.trim() || null;
      insertData.adresa_pf = validated.adresaPF?.trim() || null;
    }

    // ✅ Add Juridica-specific fields
    if (validated.tipParticipant === "Juridica") {
      insertData.denumire_societate = validated.denumireSocietate?.trim() || null;
      insertData.cui = validated.cui?.trim() || null;
      insertData.registrul_comertului = validated.registrulComertului?.trim() || null;
      insertData.sediu_social = validated.sediuSocial?.trim() || null;
      insertData.iban = validated.banca?.trim() || null;
      insertData.persoana_contact = validated.persoanadeContact?.trim() || null;
    }

    // ✅ Insert participant
    const { data: participant, error: insertError } = await supabase
      .from("participants")
      .insert(insertData)
      .select()
      .single();

    if (insertError) throw insertError;

    // ✅ Revalidate admin views + cached participants/events/analytics
    revalidatePath("/admin");
    revalidateTag("participants", { expire: 0 });
    if (validated.eventId) {
      revalidateTag(`participants-${validated.eventId}`, { expire: 0 });
    }
    revalidateTag("events", { expire: 0 });
    revalidateTag("charts", { expire: 0 });

    // ✅ Prepare email data
    const participantName = `${validated.prenume} ${validated.nume}`;
    const eventTitle = eventData.title;
    const eventDate = eventData.start_date;
    const eventLocation = eventData.location || "TBD";

    // ✅ FIRE & FORGET OPERATIONS (no await, no blocking)
    // 1. Admin notification
    notifyAdminNewRegistration({
      participantName,
      participantEmail: validated.email,
      eventTitle,
      eventId: validated.eventId,
    }).catch((err) => console.error("[NOTIFICATION] Silent fail:", err));

    // 2. Participation emails
    sendParticipationEmails({
      participantName,
      participantEmail: validated.email,
      eventTitle,
      eventDate,
      eventLocation,
      eventId: validated.eventId,
      tipParticipant: validated.tipParticipant,
      adminEmail: process.env.ADMIN_EMAIL,
    }).catch((err) => console.error("[EMAIL] Silent fail:", err));

    // 3. Audit log
    logAudit({
      action: "PARTICIPANT_REGISTERED",
      userId: "public_user",
      userEmail: validated.email,
      resource: "participants",
      resourceId: participant.id,
      details: {
        ip,
        eventId: validated.eventId,
        tipParticipant: validated.tipParticipant,
        recaptchaScore: recaptchaData.score,
      },
      severity: "info",
    }).catch((err) => console.error("[AUDIT] Silent fail:", err));

    return {
      success: true,
      message: "Înregistrare reușită!",
      participantId: participant.id,
    };
  } catch (error: any) {
    console.error("[ERROR] Registration:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validare eșuată",
      };
    }

    return { success: false, error: error.message || "Eroare la înregistrare" };
  }
}

// ============================================
// UPDATE PARTICIPANT STATUS (Admin)
// ============================================

export async function updateParticipantStatus(
  participantId: string,
  newStatus: string,
  reason?: string
) {
  try {
    const admin = await requireAdmin();
    const withinLimit = await checkAdminRateLimit(admin.id);
    if (!withinLimit) {
      throw new Error("Pra multea acțiuni. Reîncearcă mai târziu.");
    }

    // ✅ Validate input
    const validated = updateStatusSchema.parse({
      participantId,
      newStatus,
      reason,
    });

    const supabase = await createClient();

    // ✅ Fetch participant
    const { data: participant, error: selectError } = await supabase
      .from("participants")
      .select("id, status, email, event_id")
      .eq("id", validated.participantId)
      .single();

    if (selectError || !participant) {
      throw new Error("Participant nu găsit");
    }

    // ✅ Don't update if same status
    if (participant.status === validated.newStatus) {
      return { success: true, message: "Status already set" };
    }

    // ✅ Update status
    const { error: updateError } = await supabase
      .from("participants")
      .update({
        status: validated.newStatus,
        updated_at: new Date().toISOString(),
        confirmed_at:
          validated.newStatus === "confirmed"
            ? new Date().toISOString()
            : undefined,
      })
      .eq("id", validated.participantId);

    if (updateError) throw updateError;

    // ✅ Revalidate admin views + cached participants/events/analytics
    revalidatePath("/admin");
    revalidateTag("participants", { expire: 0 });
    if (participant.event_id) {
      revalidateTag(`participants-${participant.event_id}`, { expire: 0 });
    }
    revalidateTag("events", { expire: 0 });
    revalidateTag("charts", { expire: 0 });

    // ✅ FIRE & FORGET audit
    logAudit({
      action:
        validated.newStatus === "confirmed"
          ? "PARTICIPANT_CONFIRMED"
          : "PARTICIPANT_STATUS_CHANGED",
      userId: admin.id,
      userEmail: admin.email,
      resource: "participants",
      resourceId: validated.participantId,
      details: {
        oldStatus: participant.status,
        newStatus: validated.newStatus,
        reason,
        participantEmail: participant.email,
      },
      severity: "info",
    }).catch((err) => console.error("[AUDIT] Silent fail:", err));

    return { success: true, message: "Status actualizat" };
  } catch (error: any) {
    console.error("[ERROR] Update status:", error);
    return { success: false, error: error.message || "Acces interzis" };
  }
}

// ============================================
// DELETE PARTICIPANT (Admin)
// ============================================

export async function deleteParticipant(
  participantId: string,
  eventId: string
) {
  try {
    const admin = await requireAdmin();
    const withinLimit = await checkAdminRateLimit(admin.id);
    if (!withinLimit) {
      throw new Error("Pra multea acțiuni. Reîncearcă mai târziu.");
    }

    // ✅ Validate input
    const validated = deleteParticipantSchema.parse({
      participantId,
      eventId,
    });

    const supabase = await createClient();

    // ✅ Fetch participant
    const { data: participant, error: selectError } = await supabase
      .from("participants")
      .select("id, email, prenume, nume, status")
      .eq("id", validated.participantId)
      .eq("event_id", validated.eventId)
      .single();

    if (selectError || !participant) {
      throw new Error("Participant nu găsit");
    }

    // ✅ Delete participant
    const { error: deleteError } = await supabase
      .from("participants")
      .delete()
      .eq("id", validated.participantId)
      .eq("event_id", validated.eventId);

    if (deleteError) throw deleteError;

    // ✅ Revalidate admin views + cached participants/events/analytics
    revalidatePath("/admin");
    revalidateTag("participants", { expire: 0 });
    revalidateTag(`participants-${validated.eventId}`, { expire: 0 });
    revalidateTag("events", { expire: 0 });
    revalidateTag("charts", { expire: 0 });

    // ✅ FIRE & FORGET audit
    logAudit({
      action: "PARTICIPANT_DELETED",
      userId: admin.id,
      userEmail: admin.email,
      resource: "participants",
      resourceId: validated.participantId,
      details: {
        email: participant.email,
        nume: `${participant.prenume} ${participant.nume}`,
        status: participant.status,
        deletedBy: admin.email,
      },
      severity: "warning",
    }).catch((err) => console.error("[AUDIT] Silent fail:", err));

    return { success: true, message: "Participant șters" };
  } catch (error: any) {
    console.error("[ERROR] Delete:", error);
    return { success: false, error: error.message || "Acces interzis" };
  }
}

// ============================================
// EXPORT PARTICIPANTS (Admin)
// ============================================

export async function exportParticipants(eventId: string) {
  try {
    const admin = await requireAdmin();
    const withinLimit = await checkAdminRateLimit(admin.id);
    if (!withinLimit) {
      throw new Error("Pra multea acțiuni. Reîncearcă mai târziu.");
    }

    // ✅ Validate input
    if (!eventId || typeof eventId !== "string") {
      throw new Error("ID eveniment invalid");
    }

    const supabase = await createClient();

    // ✅ Fetch participants
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("event_id", eventId)
      .limit(10_000);

    if (error) throw error;

    // ✅ FIRE & FORGET audit
    logAudit({
      action: "PARTICIPANTS_EXPORTED",
      userId: admin.id,
      userEmail: admin.email,
      resource: "participants",
      resourceId: eventId,
      details: {
        count: data?.length ?? 0,
        exportedBy: admin.email,
      },
      severity: "warning",
    }).catch((err) => console.error("[AUDIT] Silent fail:", err));

    return { success: true, data: data ?? [] };
  } catch (error: any) {
    console.error("[ERROR] Export:", error);
    return { success: false, error: error.message || "Acces interzis" };
  }
}

// ============================================
// GET AUDIT LOGS (Admin)
// ============================================

export async function getAuditLogs(filters?: any) {
  try {
    const admin = await requireAdmin();
    const withinLimit = await checkAdminRateLimit(admin.id);
    if (!withinLimit) {
      throw new Error("Pra multea acțiuni. Reîncearcă mai târziu.");
    }

    const supabase = await createClient();

    // ✅ Fetch audit logs (lightweight: fără count exact, limit rezonabil)
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);

    if (error) throw error;

    // ✅ FIRE & FORGET audit
    logAudit({
      action: "AUDIT_LOGS_VIEWED",
      userId: admin.id,
      userEmail: admin.email,
      resource: "audit_logs",
      resourceId: "system",
      details: { filters, viewedBy: admin.email },
      severity: "warning",
    }).catch((err) => console.error("[AUDIT] Silent fail:", err));

    return { success: true, logs: data ?? [], total: data?.length ?? 0 };
  } catch (error: any) {
    console.error("[ERROR] Get audit logs:", error);
    return { success: false, error: error.message || "Acces interzis" };
  }
}