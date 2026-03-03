// src/server/actions/events.ts (OPTIMIZED + SECURE)
"use server";

import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createEventSchema, updateEventSchema } from "@/lib/validations";
import { requireAdmin, checkAdminRateLimit, getClientIP } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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

// ============================================
// FETCH EVENTS WITH STATS (Cached)
// ============================================
// ✅ Cached query
// ✅ Service client reused
// ✅ 1 minute cache, revalidate on mutation

async function fetchEventsWithStats() {
  "use cache";

  const { cacheTag, cacheLife } = await import("next/cache");

  cacheTag("events");
  cacheLife("minutes"); // 1 minute default, revalidate on background

  const supabase = getServiceClient();

  const { data: rawEvents, error } = await supabase.rpc(
    "get_events_with_stats_summary"
  );

  if (error) throw new Error(`RPC failed: ${error.message}`);
  if (!rawEvents || rawEvents.length === 0) return [];

  return rawEvents.map((event: any) => {
    const confirmedCount = Number(event.confirmed_participants) || 0;
    const maxParticipants = Number(event.max_participants) || 0;

    return {
      id: event.id,
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date,
      location: event.location,
      price: event.price,
      currency: event.currency,
      max_participants: maxParticipants,
      status: event.status,
      created_at: event.created_at,
      updated_at: event.updated_at,
      stats: {
        totalParticipants: Number(event.total_participants) || 0,
        confirmedParticipants: confirmedCount,
        pendingParticipants: Number(event.pending_participants) || 0,
        attendedParticipants: Number(event.attended_participants) || 0,
        noShowParticipants: Number(event.no_show_participants) || 0,
        cancelledParticipants: Number(event.cancelled_participants) || 0,
        occupancyRate:
          maxParticipants > 0
            ? Math.round((confirmedCount / maxParticipants) * 100)
            : 0,
        availableSpots: Math.max(0, maxParticipants - confirmedCount),
      },
    };
  });
}

// ============================================
// GET EVENTS WITH STATS (Admin)
// ============================================

export async function getEventsWithStats() {
  await requireAdmin();

  try {
    const events = await fetchEventsWithStats();
    return { success: true, events };
  } catch (error: any) {
    console.error("[ERROR] getEventsWithStats:", error);
    return { success: false, error: error.message || "Failed to fetch events" };
  }
}

// ============================================
// GET EVENTS (Public)
// ============================================

export async function getEvents(filters?: { status?: string; page?: number }) {
  try {
    const supabase = await createClient();
    const page = filters?.page ?? 1;
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    let query = supabase
      .from("events")
      .select("*", { count: "exact" })
      .order("start_date", { ascending: true });

    if (filters?.status) query = query.eq("status", filters.status);

    const { data, count, error } = await query.range(
      offset,
      offset + pageSize - 1
    );
    if (error) throw error;

    return {
      success: true,
      events: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
    };
  } catch (error: any) {
    console.error("[ERROR] getEvents:", error);
    return { success: false, error: "Eroare la încărcarea evenimentelor" };
  }
}

// ============================================
// GET EVENT BY ID (Public)
// ============================================

export async function getEventById(eventId: string) {
  try {
    // ✅ Validate input early
    if (!eventId || typeof eventId !== "string") {
      throw new Error("ID eveniment invalid");
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (error) throw error;
    return { success: true, event: data };
  } catch (error: any) {
    console.error("[ERROR] getEventById:", error);
    return { success: false, error: "Evenimentul nu a fost găsit" };
  }
}

// ============================================
// CREATE EVENT (Admin)
// ============================================

export async function createEvent(formData: unknown) {
  try {
    const admin = await requireAdmin();
    const withinLimit = await checkAdminRateLimit(admin.id);
    if (!withinLimit)
      throw new Error("Prea multe acțiuni. Reîncearcă mai târziu.");

    // ✅ Validate early
    const validated = createEventSchema.parse(formData);
    const ip = await getClientIP();
    const supabase = await createClient();

    // ✅ Insert event
    const { data: event, error } = await supabase
      .from("events")
      .insert({
        title: validated.title,
        description: validated.description || null,
        start_date: validated.start_date,
        end_date: validated.end_date,
        location: validated.location,
        price: validated.price,
        currency: validated.currency,
        max_participants: validated.max_participants,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;

    // ✅ Revalidate admin views + cached events/analytics
    revalidatePath("/admin");
    revalidateTag("events", { expire: 0 });
    revalidateTag("charts", { expire: 0 });

    // ✅ Async audit (fire & forget, no await)
    logAudit({
      action: "EVENT_CREATED",
      userId: admin.id,
      userEmail: admin.email,
      resource: "events",
      resourceId: event.id,
      details: {
        title: validated.title,
        start_date: validated.start_date,
        ip,
      },
      severity: "info",
    }).catch((err) => console.error("[AUDIT] Silent fail:", err));

    return {
      success: true,
      message: "Eveniment creat cu succes",
      eventId: event.id,
    };
  } catch (error: any) {
    console.error("[ERROR] createEvent:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validare eșuată",
      };
    }

    return { success: false, error: error.message || "Eroare la creare" };
  }
}

// ============================================
// UPDATE EVENT (Admin)
// ============================================

export async function updateEvent(eventId: string, formData: unknown) {
  try {
    const admin = await requireAdmin();
    const withinLimit = await checkAdminRateLimit(admin.id);
    if (!withinLimit)
      throw new Error("Pra multea acțiuni. Reîncearcă mai târziu.");

    // ✅ Validate input early
    if (!eventId || typeof eventId !== "string") {
      throw new Error("ID eveniment invalid");
    }

    const validated = updateEventSchema.parse({
      id: eventId,
      ...(formData as Record<string, any>),
    });

    const ip = await getClientIP();
    const supabase = await createClient();

    // ✅ Fetch old event for audit
    const { data: oldEvent, error: selectError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (selectError || !oldEvent) {
      throw new Error("Evenimentul nu a fost găsit");
    }

    // ✅ Build update data (only changed fields)
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (validated.title) updateData.title = validated.title;
    if (validated.description !== undefined)
      updateData.description = validated.description;
    if (validated.start_date) updateData.start_date = validated.start_date;
    if (validated.end_date) updateData.end_date = validated.end_date;
    if (validated.location) updateData.location = validated.location;
    if (validated.price !== undefined) updateData.price = validated.price;
    if (validated.currency) updateData.currency = validated.currency;
    if (validated.max_participants)
      updateData.max_participants = validated.max_participants;

    // ✅ Update event
    const { error: updateError } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", eventId);

    if (updateError) throw updateError;

    // ✅ Revalidate admin views + cached events/analytics
    revalidatePath("/admin");
    revalidateTag("events", { expire: 0 });
    revalidateTag("charts", { expire: 0 });

    // ✅ Track changes for audit
    const changes: Record<string, any> = {};
    if (validated.title && validated.title !== oldEvent.title) {
      changes.title = { old: oldEvent.title, new: validated.title };
    }
    if (
      validated.start_date &&
      validated.start_date !== oldEvent.start_date
    ) {
      changes.start_date = { old: oldEvent.start_date, new: validated.start_date };
    }

    // ✅ Async audit
    logAudit({
      action: "EVENT_UPDATED",
      userId: admin.id,
      userEmail: admin.email,
      resource: "events",
      resourceId: eventId,
      details: { changes, ip },
      severity: "info",
    }).catch((err) => console.error("[AUDIT] Silent fail:", err));

    return { success: true, message: "Eveniment actualizat cu succes" };
  } catch (error: any) {
    console.error("[ERROR] updateEvent:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues[0]?.message || "Validare eșuată",
      };
    }

    return { success: false, error: error.message || "Eroare la actualizare" };
  }
}

// ============================================
// DELETE EVENT (Admin)
// ============================================

export async function deleteEvent(eventId: string) {
  try {
    const admin = await requireAdmin();
    const withinLimit = await checkAdminRateLimit(admin.id);
    if (!withinLimit)
      throw new Error("Pra multea acțiuni. Reîncearcă mai târziu.");

    // ✅ Validate input
    if (!eventId || typeof eventId !== "string") {
      throw new Error("ID eveniment invalid");
    }

    const ip = await getClientIP();
const supabase = getServiceClient();


    // ✅ Fetch event
    const { data: event, error: selectError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (selectError || !event) {
      throw new Error("Evenimentul nu a fost găsit");
    }

    // ✅ Check for participants
    const { count: participantCount, error: countError } = await supabase
      .from("participants")
      .select("id", { count: "exact" })
      .eq("event_id", eventId);

    if (countError) throw countError;

    if (participantCount && participantCount > 0) {
      // ✅ Audit rejection
      logAudit({
        action: "EVENT_DELETE_REJECTED",
        userId: admin.id,
        userEmail: admin.email,
        resource: "events",
        resourceId: eventId,
        details: {
          eventTitle: event.title,
          participantCount,
          ip,
        },
        severity: "warning",
      }).catch((err) => console.error("[AUDIT] Silent fail:", err));

      return {
        success: false,
        error: `Nu puteți șterge: ${participantCount} participanți înregistrați.`,
      };
    }

    // ✅ Delete event
    const { error: deleteError } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (deleteError) throw deleteError;

    // ✅ Revalidate admin views + cached events/analytics
    revalidatePath("/admin");
    revalidateTag("events", { expire: 0 });
    revalidateTag("charts", { expire: 0 });

    // ✅ Async audit
    logAudit({
      action: "EVENT_DELETED",
      userId: admin.id,
      userEmail: admin.email,
      resource: "events",
      resourceId: eventId,
      details: { title: event.title, ip },
      severity: "warning",
    }).catch((err) => console.error("[AUDIT] Silent fail:", err));

    return { success: true, message: "Eveniment șters cu succes" };
  } catch (error: any) {
    console.error("[ERROR] deleteEvent:", error);
    return { success: false, error: error.message || "Eroare la ștergere" };
  }
}

// ============================================
// CHANGE EVENT STATUS (Admin)
// ============================================

export async function changeEventStatus(
  eventId: string,
  newStatus: "active" | "cancelled" | "completed",
  reason?: string
) {
  try {
    const admin = await requireAdmin();
    const withinLimit = await checkAdminRateLimit(admin.id);
    if (!withinLimit)
      throw new Error("Pra multea acțiuni. Reîncearcă mai târziu.");

    // ✅ Validate status
    if (!["active", "cancelled", "completed"].includes(newStatus)) {
      throw new Error("Status invalid");
    }

    // ✅ Validate eventId
    if (!eventId || typeof eventId !== "string") {
      throw new Error("ID eveniment invalid");
    }

    const ip = await getClientIP();
   const supabase = getServiceClient();


    // ✅ Fetch event
    const { data: event, error: selectError } = await supabase
      .from("events")
      .select("status, title")
      .eq("id", eventId)
      .single();

    if (selectError || !event) {
      throw new Error("Evenimentul nu a fost găsit");
    }

    // ✅ Don't update if same status
    if (event.status === newStatus) {
      return { success: true, message: "Status already set" };
    }

    // ✅ Update status
    const { error: updateError } = await supabase
      .from("events")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId);

    if (updateError) throw updateError;

    // ✅ Revalidate admin views + cached events/analytics
    revalidatePath("/admin");
    revalidateTag("events", { expire: 0 });
    revalidateTag("charts", { expire: 0 });

    // ✅ Async audit
    logAudit({
      action: "EVENT_STATUS_CHANGED",
      userId: admin.id,
      userEmail: admin.email,
      resource: "events",
      resourceId: eventId,
      details: {
        old_status: event.status,
        new_status: newStatus,
        reason: reason ?? null,
        ip,
      },
      severity: newStatus === "cancelled" ? "warning" : "info",
    }).catch((err) => console.error("[AUDIT] Silent fail:", err));

    return { success: true, message: `Status schimbat în: ${newStatus}` };
  } catch (error: any) {
    console.error("[ERROR] changeEventStatus:", error);
    return {
      success: false,
      error: error.message || "Eroare la schimbare status",
    };
  }
}