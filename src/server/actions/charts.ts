"use server";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth";
import { unstable_cache, revalidateTag } from "next/cache";

// ---------------------------------------------------------------------------
// INTERFEȚE
// ---------------------------------------------------------------------------

export interface RegistrationTrendData {
  date: string;
  registrations: number;
  confirmed: number;
  growth: number;
}

export interface StatusDistribution {
  status: string;
  count: number;
  percentage: number;
  color: string;
  trend: "up" | "down" | "stable";
}

export interface EventComparisonData {
  eventTitle: string;
  totalParticipants: number;
  confirmed: number;
  pending: number;
  conversionRate: number;
  attendanceRate: number;
  avgDurationDays: number;
  maxParticipants: number;
}

export interface HourlyRegistrationData {
  hour: string;
  count: number;
}

export interface DayOfWeekData {
  day: string;
  count: number;
  percentage: number;
}

export interface ConversionFunnelData {
  stage: string;
  count: number;
  percentage: number;
  dropOff: number;
}

export interface AdvancedMetrics {
  [x: string]: any;
  growthRate: number;
  avgAttendance: number;
  churnRisk: number;
  totalRegistrations: number;
  peakDay: string;
  retentionRate: number;
  mostPopularLocation: string;
  avgPrice: number;
}

export interface ChartsData {
  registrationTrend: RegistrationTrendData[];
  statusDistribution: StatusDistribution[];
  eventComparison: EventComparisonData[];
  hourlyPattern: HourlyRegistrationData[];
  dayOfWeekPattern: DayOfWeekData[];
  conversionFunnel: ConversionFunnelData[];
  advancedMetrics: AdvancedMetrics;
}

// ---------------------------------------------------------------------------
// HELPER: creează un client Supabase cu service role (fără cookies)
// Acest client este safe de folosit în interiorul `unstable_cache`.
// ---------------------------------------------------------------------------

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
    );
  }

  return createServiceClient(url, key, {
    auth: {
      // Dezactivăm persistența sesiunii – nu avem nevoie în server actions
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// ---------------------------------------------------------------------------
// LOGICA DE PROCESARE (fără I/O – doar calcule pure)
// ---------------------------------------------------------------------------

function processAnalyticsData(
  participants: any[],
  prevParticipants: any[],
  events: any[],
  allStatus: any[]
): ChartsData {
  // A. Trend înregistrări
  const trendMap: Record<string, { reg: number; conf: number }> = {};

  for (const p of participants) {
    const date = new Date(p.created_at).toISOString().split("T")[0];
    if (!trendMap[date]) trendMap[date] = { reg: 0, conf: 0 };
    trendMap[date].reg++;
    if (p.status === "confirmed" || p.status === "attended") {
      trendMap[date].conf++;
    }
  }

  let prevDayReg = 0;
  const registrationTrend: RegistrationTrendData[] = Object.entries(trendMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { reg, conf }]) => {
      const growth =
        prevDayReg > 0
          ? Math.round(((reg - prevDayReg) / prevDayReg) * 100)
          : 0;
      prevDayReg = reg;
      return { date, registrations: reg, confirmed: conf, growth };
    });

  // B. Distribuție status (perioadă curentă vs. anterioară)
  const statusCounts = allStatus.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const prevStatusCounts = prevParticipants.reduce<Record<string, number>>(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {}
  );

  const STATUS_COLORS: Record<string, string> = {
    pending: "#f59e0b",
    confirmed: "#10b981",
    attended: "#3b82f6",
    "no-show": "#ef4444",
    cancelled: "#8b5cf6",
  };

  const statusDistribution: StatusDistribution[] = Object.entries(statusCounts)
    .filter(([status]) => status && status !== "null")
    .map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage:
        allStatus.length > 0
          ? Math.round((count / allStatus.length) * 100)
          : 0,
      color: STATUS_COLORS[status] ?? "#6b7280",
      trend: (
        count > (prevStatusCounts[status] ?? 0)
          ? "up"
          : count < (prevStatusCounts[status] ?? 0)
          ? "down"
          : "stable"
      ) as "up" | "down" | "stable",
    }))
    .sort((a, b) => b.count - a.count);

  // C. Comparație evenimente
  const eventStats = new Map<
    string,
    { total: number; confirmed: number; pending: number; attended: number }
  >();

  for (const p of participants) {
    if (!p.event_id) continue;
    if (!eventStats.has(p.event_id)) {
      eventStats.set(p.event_id, {
        total: 0,
        confirmed: 0,
        pending: 0,
        attended: 0,
      });
    }
    const s = eventStats.get(p.event_id)!;
    s.total++;
    if (p.status === "confirmed") s.confirmed++;
    if (p.status === "pending") s.pending++;
    if (p.status === "attended") s.attended++;
  }

  const eventComparison: EventComparisonData[] = events
    .map((ev) => {
      const s = eventStats.get(ev.id) ?? {
        total: 0,
        confirmed: 0,
        pending: 0,
        attended: 0,
      };
      return {
        eventTitle: ev.title || "Fără titlu",
        totalParticipants: s.total,
        confirmed: s.confirmed,
        pending: s.pending,
        conversionRate:
          s.total > 0 ? Math.round((s.confirmed / s.total) * 100) : 0,
        attendanceRate:
          s.confirmed > 0
            ? Math.round((s.attended / s.confirmed) * 100)
            : 0,
        avgDurationDays:
          ev.start_date && ev.end_date
            ? Math.round(
                (new Date(ev.end_date).getTime() -
                  new Date(ev.start_date).getTime()) /
                  86_400_000
              )
            : 0,
        maxParticipants: ev.max_participants ?? 0,
      };
    })
    .filter((e) => e.totalParticipants > 0)
    .sort((a, b) => b.totalParticipants - a.totalParticipants);

  // D. Patterns orare / zilnice
  const hourlyMap: Record<number, number> = {};
  const dayMap: Record<number, number> = {};

  for (const p of participants) {
    const d = new Date(p.created_at);
    const h = d.getHours();
    const day = d.getDay();
    hourlyMap[h] = (hourlyMap[h] || 0) + 1;
    dayMap[day] = (dayMap[day] || 0) + 1;
  }

  const hourlyPattern: HourlyRegistrationData[] = Array.from(
    { length: 24 },
    (_, i) => ({
      hour: `${String(i).padStart(2, "0")}:00`,
      count: hourlyMap[i] ?? 0,
    })
  );

  const DAYS_RO = [
    "Duminică",
    "Luni",
    "Marți",
    "Miercuri",
    "Joi",
    "Vineri",
    "Sâmbătă",
  ];

  const dayOfWeekPattern: DayOfWeekData[] = DAYS_RO.map((day, i) => ({
    day,
    count: dayMap[i] ?? 0,
    percentage:
      participants.length > 0
        ? Math.round(((dayMap[i] ?? 0) / participants.length) * 100)
        : 0,
  }));

  // E. Most popular location (număr participanți per locație)
  const eventIdToLocation = new Map<string, string>();
  for (const ev of events) {
    if (ev.id && ev.location) {
      eventIdToLocation.set(ev.id, ev.location);
    }
  }

  const locationCounts: Record<string, number> = {};
  for (const p of participants) {
    if (!p.event_id) continue;
    const loc = eventIdToLocation.get(p.event_id);
    if (!loc) continue;
    locationCounts[loc] = (locationCounts[loc] || 0) + 1;
  }

  let mostPopularLocation = "N/A";
  const locationEntries = Object.entries(locationCounts);
  if (locationEntries.length > 0) {
    mostPopularLocation = locationEntries.sort((a, b) => b[1] - a[1])[0][0];
  }

  // F. Conversion funnel
  const confirmedTotal = statusCounts["confirmed"] ?? 0;
  const attendedTotal = statusCounts["attended"] ?? 0;

  const conversionFunnel: ConversionFunnelData[] = [
    {
      stage: "Înregistrați",
      count: participants.length,
      percentage: 100,
      dropOff: 0,
    },
    {
      stage: "Confirmați",
      count: confirmedTotal,
      percentage:
        participants.length > 0
          ? Math.round((confirmedTotal / participants.length) * 100)
          : 0,
      dropOff:
        participants.length > 0
          ? 100 - Math.round((confirmedTotal / participants.length) * 100)
          : 0,
    },
    {
      stage: "Prezenți",
      count: attendedTotal,
      percentage:
        confirmedTotal > 0
          ? Math.round((attendedTotal / confirmedTotal) * 100)
          : 0,
      dropOff:
        confirmedTotal > 0
          ? 100 - Math.round((attendedTotal / confirmedTotal) * 100)
          : 0,
    },
  ];

  // G. Metrici avansate
  const churnRisk =
    statusDistribution.find((s) => s.status.toLowerCase() === "cancelled")
      ?.percentage ?? 0;

  const peakDayIndex = dayOfWeekPattern.reduce(
    (iMax, x, i, arr) => (x.count > arr[iMax].count ? i : iMax),
    0
  );

  const avgAttendance =
    eventComparison.length > 0
      ? eventComparison.reduce((sum, e) => sum + e.attendanceRate, 0) /
        eventComparison.length
      : 0;

  const advancedMetrics: AdvancedMetrics = {
    growthRate:
      prevParticipants.length > 0
        ? Math.round(
            ((participants.length - prevParticipants.length) /
              prevParticipants.length) *
              100
          )
        : 100,
    avgAttendance: Math.round(avgAttendance),
    churnRisk,
    totalRegistrations: participants.length,
    peakDay: DAYS_RO[peakDayIndex],
    retentionRate: 100 - churnRisk,
    mostPopularLocation,
    avgPrice:
      events.length > 0
        ? Math.round(
            events.reduce((a, b) => a + (b.price ?? 0), 0) / events.length
          )
        : 0,
  };

  return {
    registrationTrend,
    statusDistribution,
    eventComparison,
    hourlyPattern,
    dayOfWeekPattern,
    conversionFunnel,
    advancedMetrics,
  };
}

// ---------------------------------------------------------------------------
// CACHE — definit la nivel de MODUL (nu în interiorul funcției!)
// Folosește service client → fără cookies() → safe în unstable_cache.
// Key-ul include `days` pentru a cachea separat fiecare interval.
// ---------------------------------------------------------------------------

const getCachedAnalytics = unstable_cache(
  async (days: number): Promise<ChartsData> => {
    const supabase = getServiceClient();

    const now = new Date();
    const endDate = now.toISOString();

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    const startISO = startDate.toISOString();

    const prevStart = new Date(startDate);
    prevStart.setDate(prevStart.getDate() - days);
    const prevStartISO = prevStart.toISOString();

    const [
      { data: participants, error: e1 },
      { data: prevParticipants, error: e2 },
      { data: events, error: e3 },
      { data: allStatus, error: e4 },
    ] = await Promise.all([
      supabase
        .from("participants")
        .select("created_at, status, event_id, confirmed_at")
        .gte("created_at", startISO)
        .lte("created_at", endDate),

      supabase
        .from("participants")
        .select("status, created_at")
        .gte("created_at", prevStartISO)
        .lt("created_at", startISO),

      supabase
        .from("events")
        .select(
          "id, title, start_date, end_date, max_participants, price, currency, location, status"
        ),

      supabase.from("participants").select("status"),
    ]);

    // Aruncăm erori explicit pentru a le prinde în getChartsData
    if (e1) throw new Error(`participants fetch failed: ${e1.message}`);
    if (e2) throw new Error(`prevParticipants fetch failed: ${e2.message}`);
    if (e3) throw new Error(`events fetch failed: ${e3.message}`);
    if (e4) throw new Error(`allStatus fetch failed: ${e4.message}`);

    return processAnalyticsData(
      participants ?? [],
      prevParticipants ?? [],
      events ?? [],
      allStatus ?? []
    );
  },
  // Cache key — include variabila `days` automat prin argument
  ["admin-analytics-data"],
  {
    revalidate: 3600, // 1 oră
    tags: ["charts"],
  }
);

// ---------------------------------------------------------------------------
// SERVER ACTIONS EXPORTATE
// ---------------------------------------------------------------------------

/**
 * Returnează datele pentru grafice analytics.
 * Auth se verifică aici (cookies OK în server action),
 * fetch-ul și procesarea sunt în cache-ul de mai sus.
 */
export async function getChartsData(
  days: number = 30
): Promise<{ success: true; data: ChartsData } | { success: false; error: string }> {
  try {
    await requireAdmin(); // cookies() e safe doar în afara unstable_cache
    const data = await getCachedAnalytics(days);
    return { success: true, data };
  } catch (err: any) {
    console.error("[getChartsData]", err);
    return { success: false, error: err.message ?? "Unknown error" };
  }
}

/**
 * Invalidează cache-ul graficelor și forțează re-fetch la următoarea cerere.
 */
export async function refreshCharts(): Promise<
  { success: true } | { success: false; error: string }
> {
  try {
    await requireAdmin();
    revalidateTag("charts", { expire: 0 });
    return { success: true };
  } catch (err: any) {
    console.error("[refreshCharts]", err);
    return { success: false, error: err.message ?? "Unknown error" };
  }
}