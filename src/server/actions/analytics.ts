// src/server/actions/analytics.ts (NEW - Dashboard analytics)
"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth";

/**
 * ============================================
 * ANALYTICS DATA TYPES
 * ============================================
 */

export interface EventAnalytics {
  eventId: string;
  eventTitle: string;
  totalParticipants: number;
  confirmedParticipants: number;
  pendingParticipants: number;
  attendedParticipants: number;
  noShowParticipants: number;
  cancellledParticipants: number;
  conversionRate: number; // confirmed / total
  attendanceRate: number; // attended / confirmed
  registrationsOverTime: Array<{ date: string; count: number }>;
}

export interface DashboardAnalytics {
  totalEvents: number;
  activeEvents: number;
  completedEvents: number;
  totalParticipants: number;
  confirmedParticipants: number;
  pendingParticipants: number;
  cancelledParticipants: number;
  overallConversionRate: number;
  overallAttendanceRate: number;
  upcomingEvents: Array<{ id: string; title: string; startDate: string; participantCount: number }>;
  topEvents: Array<{ id: string; title: string; participantCount: number; conversionRate: number }>;
  recentRegistrations: Array<{
    id: string;
    participantName: string;
    email: string;
    eventTitle: string;
    registeredAt: string;
    status: string;
  }>;
}

/**
 * ============================================
 * SERVICE CLIENT (SUPABASE) — server-side only
 * ============================================
 * Folosit împreună cu "use cache" pentru a nu depinde de cookies/user.
 */

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

/**
 * ============================================
 * INTERNAL: FETCH DASHBOARD ANALYTICS (cached)
 * ============================================
 * Folosește:
 * - "use cache" + cacheTag("dashboard-analytics")
 * - RPC get_events_with_stats_summary (agregate pe event)
 * - doar 10 înregistrări recente din participants
 */

async function fetchDashboardAnalytics(): Promise<DashboardAnalytics> {
  "use cache";

  const { cacheTag, cacheLife } = await import("next/cache");

  cacheTag("dashboard-analytics");
  cacheLife("minutes"); // cache de ordinul minutelor, revalidat prin revalidateTag

  const supabase = getServiceClient();

  // ✅ Folosește RPC agregat pentru evenimente + statistici
  const { data: rawEvents, error: eventsError } = await supabase.rpc(
    "get_events_with_stats_summary"
  );

  if (eventsError) throw eventsError;

  if (!rawEvents || rawEvents.length === 0) {
    return {
      totalEvents: 0,
      activeEvents: 0,
      completedEvents: 0,
      totalParticipants: 0,
      confirmedParticipants: 0,
      pendingParticipants: 0,
      cancelledParticipants: 0,
      overallConversionRate: 0,
      overallAttendanceRate: 0,
      upcomingEvents: [],
      topEvents: [],
      recentRegistrations: [],
    };
  }

  const now = new Date();

  let totalParticipants = 0;
  let confirmedParticipants = 0;
  let pendingParticipants = 0;
  let cancelledParticipants = 0;
  let attendedParticipants = 0;

  const upcomingEvents: any[] = [];
  const topEvents: any[] = [];

  rawEvents.forEach((event: any) => {
    const statsTotal = Number(event.total_participants) || 0;
    const statsConfirmed = Number(event.confirmed_participants) || 0;
    const statsPending = Number(event.pending_participants) || 0;
    const statsCancelled = Number(event.cancelled_participants) || 0;
    const statsAttended = Number(event.attended_participants) || 0;

    totalParticipants += statsTotal;
    confirmedParticipants += statsConfirmed;
    pendingParticipants += statsPending;
    cancelledParticipants += statsCancelled;
    attendedParticipants += statsAttended;

    const startDate = event.start_date ? new Date(event.start_date) : null;

    // Upcoming events (status = active and date in future)
    if (event.status === "active" && startDate && startDate > now) {
      upcomingEvents.push({
        id: event.id,
        title: event.title,
        startDate: event.start_date,
        participantCount: statsTotal,
      });
    }

    // Top events by participants
    if (statsTotal > 0) {
      const conversionRate = Math.round((statsConfirmed / statsTotal) * 100);
      topEvents.push({
        id: event.id,
        title: event.title,
        participantCount: statsTotal,
        conversionRate,
      });
    }
  });

  // ✅ Sort and slice
  topEvents.sort((a, b) => b.participantCount - a.participantCount);
  upcomingEvents.sort(
    (a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  // ✅ Fetch recent registrations (doar câteva rânduri, nu listă mare)
  const { data: recentRegistrations, error: recentError } = await supabase
    .from("participants")
    .select(
      `
        id,
        prenume,
        nume,
        email,
        status,
        created_at,
        events(title)
      `
    )
    .order("created_at", { ascending: false })
    .limit(10);

  if (recentError) throw recentError;

  const formattedRecent = (recentRegistrations || []).map((reg: any) => ({
    id: reg.id,
    participantName: `${reg.prenume} ${reg.nume}`,
    email: reg.email,
    eventTitle: reg.events?.title || "Unknown",
    registeredAt: reg.created_at,
    status: reg.status,
  }));

  const overallConversionRate =
    totalParticipants > 0
      ? Math.round((confirmedParticipants / totalParticipants) * 100)
      : 0;

  const overallAttendanceRate =
    confirmedParticipants > 0
      ? Math.round((attendedParticipants / confirmedParticipants) * 100)
      : 0;

  const activeEvents = rawEvents.filter(
    (e: any) => e.status === "active"
  ).length;
  const completedEvents = rawEvents.filter(
    (e: any) => e.status === "completed"
  ).length;

  return {
    totalEvents: rawEvents.length,
    activeEvents,
    completedEvents,
    totalParticipants,
    confirmedParticipants,
    pendingParticipants,
    cancelledParticipants,
    overallConversionRate,
    overallAttendanceRate,
    upcomingEvents: upcomingEvents.slice(0, 5),
    topEvents: topEvents.slice(0, 5),
    recentRegistrations: formattedRecent,
  };
}

/**
 * ============================================
 * GET DASHBOARD ANALYTICS (Admin API)
 * ============================================
 */

export async function getDashboardAnalytics(): Promise<{
  success: boolean;
  data?: DashboardAnalytics;
  error?: string;
}> {
  try {
    // ✅ Require admin access (Clerk + whitelist + rate limit)
    await requireAdmin();

    const analytics = await fetchDashboardAnalytics();
    return { success: true, data: analytics };
  } catch (error: any) {
    console.error("[ANALYTICS] Error:", error);
    return {
      success: false,
      error: error.message || "Failed to load analytics",
    };
  }
}

/**
 * ============================================
 * GET EVENT DETAILED ANALYTICS
 * ============================================
 */

export async function getEventAnalytics(eventId: string): Promise<{
  success: boolean;
  data?: EventAnalytics;
  error?: string;
}> {
  try {
    // ✅ Require admin
    await requireAdmin();

    const supabase = await createClient();

    // ✅ Fetch event with participants
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select(`
        id,
        title,
        participants(id, status, created_at)
      `)
      .eq("id", eventId)
      .single();

    if (eventError) throw eventError;
    if (!event) throw new Error("Event not found");

    const participants = event.participants || [];

    // ✅ Count by status
    const confirmed = participants.filter(
      (p: any) => p.status === "confirmed"
    ).length;
    const pending = participants.filter(
      (p: any) => p.status === "pending"
    ).length;
    const attended = participants.filter(
      (p: any) => p.status === "attended"
    ).length;
    const noShow = participants.filter(
      (p: any) => p.status === "no-show"
    ).length;
    const cancelled = participants.filter(
      (p: any) => p.status === "cancelled"
    ).length;

    // ✅ Group registrations by date
    const registrationsByDate: Record<string, number> = {};
    participants.forEach((p: any) => {
      const date = new Date(p.created_at).toISOString().split("T")[0];
      registrationsByDate[date] = (registrationsByDate[date] || 0) + 1;
    });

    const registrationsOverTime = Object.entries(registrationsByDate)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, count]) => ({ date, count }));

    // ✅ Calculate rates
    const conversionRate =
      participants.length > 0
        ? Math.round((confirmed / participants.length) * 100)
        : 0;

    const attendanceRate =
      confirmed > 0 ? Math.round((attended / confirmed) * 100) : 0;

    const analytics: EventAnalytics = {
      eventId: event.id,
      eventTitle: event.title,
      totalParticipants: participants.length,
      confirmedParticipants: confirmed,
      pendingParticipants: pending,
      attendedParticipants: attended,
      noShowParticipants: noShow,
      cancellledParticipants: cancelled,
      conversionRate,
      attendanceRate,
      registrationsOverTime,
    };

    return { success: true, data: analytics };
  } catch (error: any) {
    console.error("[EVENT ANALYTICS] Error:", error);
    return {
      success: false,
      error: error.message || "Failed to load event analytics",
    };
  }
}