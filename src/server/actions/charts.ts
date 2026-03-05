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
  cancelled: number;
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
  eventId: string;
  location: string;
  totalParticipants: number;
  confirmed: number;
  pending: number;
  attended: number;
  cancelled: number;
  conversionRate: number;
  attendanceRate: number;
  fillRate: number;
  avgDurationDays: number;
  maxParticipants: number;
  price: number;
  currency: string;
  revenue: number;
  startDate: string;
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

export interface HeatmapDay {
  date: string;
  count: number;
  dayOfWeek: number;
  week: number;
}

export interface RadarEventData {
  eventTitle: string;
  conversionRate: number;
  attendanceRate: number;
  fillRate: number;
  retentionScore: number;
  engagementScore: number;
}

export interface StatusTransitionData {
  from: string;
  to: string;
  count: number;
}

export interface AuditActivityData {
  date: string;
  logins: number;
  actions: number;
  errors: number;
}

export interface NotificationData {
  type: string;
  count: number;
  readRate: number;
}

export interface ParticipantCohortData {
  cohort: string;
  week0: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
}

export interface TopParticipantData {
  name: string;
  email: string;
  eventsAttended: number;
  confirmedRate: number;
  lastSeen: string;
}

export interface GeographicData {
  location: string;
  count: number;
  percentage: number;
}

export interface TipParticipantData {
  tip: string;
  count: number;
  percentage: number;
}

export interface AdvancedMetrics {
  growthRate: number;
  avgAttendance: number;
  churnRisk: number;
  totalRegistrations: number;
  peakDay: string;
  retentionRate: number;
  mostPopularLocation: string;
  avgPrice: number;
  totalRevenue: number;
  avgFillRate: number;
  noShowRate: number;
  totalEvents: number;
  totalAuditActions: number;
  unreadNotifications: number;
  avgTimeToConfirm: number;
}

export interface ChartsData {
  registrationTrend: RegistrationTrendData[];
  statusDistribution: StatusDistribution[];
  eventComparison: EventComparisonData[];
  hourlyPattern: HourlyRegistrationData[];
  dayOfWeekPattern: DayOfWeekData[];
  conversionFunnel: ConversionFunnelData[];
  heatmapData: HeatmapDay[];
  radarData: RadarEventData[];
  statusTransitions: StatusTransitionData[];
  auditActivity: AuditActivityData[];
  notificationStats: NotificationData[];
  cohortData: ParticipantCohortData[];
  topParticipants: TopParticipantData[];
  geographicData: GeographicData[];
  tipParticipantData: TipParticipantData[];
  advancedMetrics: AdvancedMetrics;
  meta: {
    generatedAt: string;
    days: number;
    totalParticipantsInDb: number;
    totalEventsInDb: number;
  };
}

// ---------------------------------------------------------------------------
// SERVICE CLIENT
// ---------------------------------------------------------------------------

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars.");
  return createServiceClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function daysBetween(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

function hoursBetween(a: string, b: string) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 3_600_000;
}

function clamp(v: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, v));
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#10b981",
  attended: "#3b82f6",
  "no-show": "#ef4444",
  cancelled: "#8b5cf6",
  rejected: "#f43f5e",
  waitlisted: "#06b6d4",
};

// ---------------------------------------------------------------------------
// PROCESARE PURĂ
// ---------------------------------------------------------------------------

function processAnalyticsData(
  participants: any[],
  prevParticipants: any[],
  events: any[],
  allParticipants: any[],
  statusHistory: any[],
  auditLogs: any[],
  adminNotifications: any[],
  days: number
): ChartsData {
  const now = new Date();

  // ── A. REGISTRATION TREND ─────────────────────────────────────────────
  const trendMap: Record<string, { reg: number; conf: number; canc: number }> = {};
  for (const p of participants) {
    const date = new Date(p.created_at).toISOString().split("T")[0];
    if (!trendMap[date]) trendMap[date] = { reg: 0, conf: 0, canc: 0 };
    trendMap[date].reg++;
    if (p.status === "confirmed" || p.status === "attended") trendMap[date].conf++;
    if (p.status === "cancelled") trendMap[date].canc++;
  }

  let prevReg = 0;
  const registrationTrend: RegistrationTrendData[] = Object.entries(trendMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { reg, conf, canc }]) => {
      const growth = prevReg > 0 ? Math.round(((reg - prevReg) / prevReg) * 100) : 0;
      prevReg = reg;
      return { date, registrations: reg, confirmed: conf, cancelled: canc, growth };
    });

  // ── B. STATUS DISTRIBUTION ────────────────────────────────────────────
  const statusCounts = allParticipants.reduce<Record<string, number>>((acc, p) => {
    if (p.status) acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const prevStatusCounts = prevParticipants.reduce<Record<string, number>>((acc, p) => {
    if (p.status) acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const statusDistribution: StatusDistribution[] = Object.entries(statusCounts)
    .map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      percentage: allParticipants.length > 0
        ? Math.round((count / allParticipants.length) * 100) : 0,
      color: STATUS_COLORS[status] ?? "#6b7280",
      trend: (count > (prevStatusCounts[status] ?? 0) ? "up"
        : count < (prevStatusCounts[status] ?? 0) ? "down"
        : "stable") as "up" | "down" | "stable",
    }))
    .sort((a, b) => b.count - a.count);

  // ── C. EVENT COMPARISON ───────────────────────────────────────────────
  // Calculăm revenue real din amount_paid per participant
  const eventRevenue = new Map<string, number>();
  const eventStats = new Map<string, {
    total: number; confirmed: number; pending: number; attended: number; cancelled: number;
  }>();

  for (const p of allParticipants) {
    if (!p.event_id) continue;
    if (!eventStats.has(p.event_id)) {
      eventStats.set(p.event_id, { total: 0, confirmed: 0, pending: 0, attended: 0, cancelled: 0 });
    }
    const s = eventStats.get(p.event_id)!;
    s.total++;
    if (p.status === "confirmed") s.confirmed++;
    if (p.status === "pending") s.pending++;
    if (p.status === "attended") s.attended++;
    if (p.status === "cancelled") s.cancelled++;

    // Sumăm amount_paid real
    if (p.amount_paid && p.amount_paid > 0) {
      eventRevenue.set(p.event_id, (eventRevenue.get(p.event_id) ?? 0) + Number(p.amount_paid));
    }
  }

  const eventComparison: EventComparisonData[] = events
    .map((ev) => {
      const s = eventStats.get(ev.id) ?? { total: 0, confirmed: 0, pending: 0, attended: 0, cancelled: 0 };
      return {
        eventTitle: ev.title || "Fără titlu",
        eventId: ev.id,
        location: ev.location || "N/A",
        totalParticipants: s.total,
        confirmed: s.confirmed,
        pending: s.pending,
        attended: s.attended,
        cancelled: s.cancelled,
        conversionRate: s.total > 0 ? Math.round((s.confirmed / s.total) * 100) : 0,
        attendanceRate: s.confirmed > 0 ? Math.round((s.attended / s.confirmed) * 100) : 0,
        fillRate: ev.max_participants > 0
          ? Math.round((s.total / ev.max_participants) * 100) : 0,
        avgDurationDays: ev.start_date && ev.end_date
          ? daysBetween(ev.start_date, ev.end_date) : 0,
        maxParticipants: ev.max_participants ?? 0,
        price: ev.price ?? 0,
        currency: ev.currency ?? "RON",
        revenue: Math.round(eventRevenue.get(ev.id) ?? 0),
        startDate: ev.start_date ?? "",
      };
    })
    .sort((a, b) => b.totalParticipants - a.totalParticipants);

  // ── D. HOURLY & DAY-OF-WEEK PATTERNS ─────────────────────────────────
  const hourlyMap: Record<number, number> = {};
  const dayMap: Record<number, number> = {};
  for (const p of participants) {
    const d = new Date(p.created_at);
    hourlyMap[d.getHours()] = (hourlyMap[d.getHours()] || 0) + 1;
    dayMap[d.getDay()] = (dayMap[d.getDay()] || 0) + 1;
  }

  const hourlyPattern: HourlyRegistrationData[] = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, "0")}:00`,
    count: hourlyMap[i] ?? 0,
  }));

  const DAYS_RO = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
  const dayOfWeekPattern: DayOfWeekData[] = DAYS_RO.map((day, i) => ({
    day,
    count: dayMap[i] ?? 0,
    percentage: participants.length > 0
      ? Math.round(((dayMap[i] ?? 0) / participants.length) * 100) : 0,
  }));

  // ── E. CONVERSION FUNNEL ──────────────────────────────────────────────
  const confirmedTotal = (statusCounts["confirmed"] ?? 0) + (statusCounts["attended"] ?? 0);
  const attendedTotal = statusCounts["attended"] ?? 0;
  const noShowTotal = statusCounts["no-show"] ?? 0;

  const conversionFunnel: ConversionFunnelData[] = [
    { stage: "Înregistrați", count: allParticipants.length, percentage: 100, dropOff: 0 },
    {
      stage: "Confirmați",
      count: confirmedTotal,
      percentage: allParticipants.length > 0
        ? Math.round((confirmedTotal / allParticipants.length) * 100) : 0,
      dropOff: allParticipants.length > 0
        ? 100 - Math.round((confirmedTotal / allParticipants.length) * 100) : 0,
    },
    {
      stage: "Prezenți",
      count: attendedTotal,
      percentage: confirmedTotal > 0
        ? Math.round((attendedTotal / confirmedTotal) * 100) : 0,
      dropOff: confirmedTotal > 0
        ? 100 - Math.round((attendedTotal / confirmedTotal) * 100) : 0,
    },
    {
      stage: "No-Show",
      count: noShowTotal,
      percentage: confirmedTotal > 0
        ? Math.round((noShowTotal / confirmedTotal) * 100) : 0,
      dropOff: 0,
    },
  ];

  // ── F. HEATMAP CALENDAR ───────────────────────────────────────────────
  const heatCountMap: Record<string, number> = {};
  for (const p of participants) {
    const date = new Date(p.created_at).toISOString().split("T")[0];
    heatCountMap[date] = (heatCountMap[date] || 0) + 1;
  }

  const heatmapData: HeatmapDay[] = [];
  const startHeat = new Date(now);
  startHeat.setDate(startHeat.getDate() - days);
  const firstMonday = new Date(startHeat);
  const dow = firstMonday.getDay();
  firstMonday.setDate(firstMonday.getDate() - (dow === 0 ? 6 : dow - 1));

  for (let d = new Date(startHeat); d <= now; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const diffDays = Math.floor((d.getTime() - firstMonday.getTime()) / 86_400_000);
    heatmapData.push({
      date: dateStr,
      count: heatCountMap[dateStr] ?? 0,
      dayOfWeek: d.getDay(),
      week: Math.floor(diffDays / 7),
    });
  }

  // ── G. RADAR DATA ─────────────────────────────────────────────────────
  const radarData: RadarEventData[] = eventComparison
    .filter((e) => e.totalParticipants > 0)
    .slice(0, 6)
    .map((e) => {
      const engagementScore = e.totalParticipants > 0
        ? Math.round(((e.confirmed + e.attended) / e.totalParticipants) * 100) : 0;
      const cancelRate = e.totalParticipants > 0
        ? Math.round((e.cancelled / e.totalParticipants) * 100) : 0;
      return {
        eventTitle: e.eventTitle.length > 20 ? e.eventTitle.slice(0, 18) + "…" : e.eventTitle,
        conversionRate: e.conversionRate,
        attendanceRate: e.attendanceRate,
        fillRate: Math.min(e.fillRate, 100),
        retentionScore: 100 - cancelRate,
        engagementScore,
      };
    });

  // ── H. STATUS TRANSITIONS ─────────────────────────────────────────────
  // status_history folosește changed_at (nu created_at)
  const transitionMap: Record<string, number> = {};
  for (const sh of statusHistory) {
    if (!sh.old_status || !sh.new_status) continue;
    const key = `${sh.old_status}→${sh.new_status}`;
    transitionMap[key] = (transitionMap[key] || 0) + 1;
  }

  const statusTransitions: StatusTransitionData[] = Object.entries(transitionMap)
    .map(([key, count]) => {
      const [from, to] = key.split("→");
      return { from, to, count };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // ── I. AUDIT ACTIVITY ─────────────────────────────────────────────────
  // audit_logs: action, resource, severity, user_email
  const auditMap: Record<string, { logins: number; actions: number; errors: number }> = {};
  for (const log of auditLogs) {
    const date = new Date(log.created_at).toISOString().split("T")[0];
    if (!auditMap[date]) auditMap[date] = { logins: 0, actions: 0, errors: 0 };
    const action = (log.action || "").toLowerCase();
    const severity = (log.severity || "info").toLowerCase();
    if (action.includes("login") || action.includes("sign_in")) auditMap[date].logins++;
    else if (severity === "error" || severity === "critical") auditMap[date].errors++;
    else auditMap[date].actions++;
  }

  const auditActivity: AuditActivityData[] = Object.entries(auditMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }));

  // ── J. NOTIFICATION STATS ─────────────────────────────────────────────
  // admin_notifications: type, read (boolean)
  const notifMap: Record<string, { total: number; read: number }> = {};
  for (const n of adminNotifications) {
    const type = n.type || "general";
    if (!notifMap[type]) notifMap[type] = { total: 0, read: 0 };
    notifMap[type].total++;
    if (n.read === true) notifMap[type].read++;
  }

  const notificationStats: NotificationData[] = Object.entries(notifMap)
    .map(([type, { total, read }]) => ({
      type,
      count: total,
      readRate: total > 0 ? Math.round((read / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // ── K. COHORT RETENTION ───────────────────────────────────────────────
  const cohortMap: Record<string, Set<string>[]> = {};
  for (const p of allParticipants) {
    if (!p.created_at || !p.id) continue;
    const regDate = new Date(p.created_at);
    const weekStart = new Date(regDate);
    weekStart.setDate(weekStart.getDate() - regDate.getDay());
    const cohortKey = weekStart.toISOString().split("T")[0];
    if (!cohortMap[cohortKey]) {
      cohortMap[cohortKey] = Array.from({ length: 5 }, () => new Set<string>());
    }
    cohortMap[cohortKey][0].add(p.id);
  }

  // status_history folosește changed_at
  for (const sh of statusHistory) {
    if (!sh.participant_id || !sh.changed_at) continue;
    const participantReg = allParticipants.find((p) => p.id === sh.participant_id);
    if (!participantReg?.created_at) continue;

    const regDate = new Date(participantReg.created_at);
    const weekStart = new Date(regDate);
    weekStart.setDate(weekStart.getDate() - regDate.getDay());
    const cohortKey = weekStart.toISOString().split("T")[0];
    if (!cohortMap[cohortKey]) continue;

    const actionDate = new Date(sh.changed_at);
    const weekDiff = Math.floor(
      (actionDate.getTime() - weekStart.getTime()) / (7 * 86_400_000)
    );
    if (weekDiff >= 1 && weekDiff <= 4) {
      cohortMap[cohortKey][weekDiff].add(sh.participant_id);
    }
  }

  const cohortData: ParticipantCohortData[] = Object.entries(cohortMap)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 6)
    .map(([cohort, weeks]) => {
      const base = weeks[0].size || 1;
      return {
        cohort,
        week0: weeks[0].size,
        week1: Math.round((weeks[1].size / base) * 100),
        week2: Math.round((weeks[2].size / base) * 100),
        week3: Math.round((weeks[3].size / base) * 100),
        week4: Math.round((weeks[4].size / base) * 100),
      };
    });

  // ── L. TOP PARTICIPANTS ───────────────────────────────────────────────
  // participants: email, nume, prenume (nu name/full_name/user_id)
  const participantEventCount: Record<string, {
    attended: number; total: number; confirmed: number; lastDate: string; name: string; email: string;
  }> = {};

  for (const p of allParticipants) {
    const id = p.email || p.id; // email e UNIQUE per event, id e global unic
    if (!id) continue;
    if (!participantEventCount[id]) {
      participantEventCount[id] = {
        attended: 0, total: 0, confirmed: 0,
        lastDate: p.created_at || "",
        name: `${p.prenume || ""} ${p.nume || ""}`.trim() || "—",
        email: p.email || "—",
      };
    }
    const rec = participantEventCount[id];
    rec.total++;
    if (p.status === "attended") rec.attended++;
    if (p.status === "confirmed" || p.status === "attended") rec.confirmed++;
    if (p.created_at > rec.lastDate) rec.lastDate = p.created_at;
  }

  const topParticipants: TopParticipantData[] = Object.values(participantEventCount)
    .filter((r) => r.total >= 2)
    .sort((a, b) => b.attended - a.attended)
    .slice(0, 10)
    .map((r) => ({
      name: r.name,
      email: r.email,
      eventsAttended: r.attended,
      confirmedRate: r.total > 0 ? Math.round((r.confirmed / r.total) * 100) : 0,
      lastSeen: r.lastDate ? new Date(r.lastDate).toLocaleDateString("ro-RO") : "—",
    }));

  // ── M. GEOGRAPHIC DATA ────────────────────────────────────────────────
  const locMap: Record<string, number> = {};
  for (const ev of events) {
    if (!ev.location) continue;
    const loc = ev.location.trim();
    const participantsHere = eventStats.get(ev.id)?.total ?? 0;
    locMap[loc] = (locMap[loc] || 0) + participantsHere;
  }

  const locTotal = Object.values(locMap).reduce((a, b) => a + b, 0);
  const geographicData: GeographicData[] = Object.entries(locMap)
    .sort((a, b) => b[1] - a[1])
    .map(([location, count]) => ({
      location,
      count,
      percentage: locTotal > 0 ? Math.round((count / locTotal) * 100) : 0,
    }));

  // ── N. TIP PARTICIPANT ────────────────────────────────────────────────
  // Coloana tip_participant din schema reală
  const tipMap: Record<string, number> = {};
  for (const p of allParticipants) {
    const tip = p.tip_participant || "necunoscut";
    tipMap[tip] = (tipMap[tip] || 0) + 1;
  }

  const tipParticipantData: TipParticipantData[] = Object.entries(tipMap)
    .sort((a, b) => b[1] - a[1])
    .map(([tip, count]) => ({
      tip,
      count,
      percentage: allParticipants.length > 0
        ? Math.round((count / allParticipants.length) * 100) : 0,
    }));

  // ── O. ADVANCED METRICS ───────────────────────────────────────────────
  const churnRisk = statusCounts["cancelled"]
    ? Math.round((statusCounts["cancelled"] / allParticipants.length) * 100) : 0;

  const noShowRate = confirmedTotal > 0
    ? Math.round((noShowTotal / confirmedTotal) * 100) : 0;

  const peakDayIndex = dayOfWeekPattern.reduce(
    (iMax, x, i, arr) => (x.count > arr[iMax].count ? i : iMax), 0
  );

  const avgAttendance = eventComparison.length > 0
    ? Math.round(eventComparison.reduce((s, e) => s + e.attendanceRate, 0) / eventComparison.length)
    : 0;

  const avgFillRate = eventComparison.filter((e) => e.maxParticipants > 0).length > 0
    ? Math.round(
        eventComparison
          .filter((e) => e.maxParticipants > 0)
          .reduce((s, e) => s + e.fillRate, 0) /
          eventComparison.filter((e) => e.maxParticipants > 0).length
      ) : 0;

  const totalRevenue = eventComparison.reduce((s, e) => s + e.revenue, 0);

  const mostPopularLocation = geographicData[0]?.location ?? "N/A";

  const avgPrice = events.length > 0
    ? Math.round(events.reduce((a, b) => a + (b.price ?? 0), 0) / events.length) : 0;

  // Timp mediu confirmare: confirmed_at - created_at (în ore)
  const confirmTimes = allParticipants
    .filter((p) => p.created_at && p.confirmed_at)
    .map((p) => hoursBetween(p.created_at, p.confirmed_at))
    .filter((h) => h > 0 && h < 24 * 30);

  const avgTimeToConfirm = confirmTimes.length > 0
    ? Math.round(confirmTimes.reduce((a, b) => a + b, 0) / confirmTimes.length) : 0;

  // admin_notifications: câmp read (boolean)
  const unreadNotifications = adminNotifications.filter((n) => !n.read).length;

  const advancedMetrics: AdvancedMetrics = {
    growthRate: prevParticipants.length > 0
      ? Math.round(((participants.length - prevParticipants.length) / prevParticipants.length) * 100)
      : 100,
    avgAttendance,
    churnRisk,
    totalRegistrations: allParticipants.length,
    peakDay: DAYS_RO[peakDayIndex],
    retentionRate: 100 - churnRisk,
    mostPopularLocation,
    avgPrice,
    totalRevenue,
    avgFillRate,
    noShowRate,
    totalEvents: events.length,
    totalAuditActions: auditLogs.length,
    unreadNotifications,
    avgTimeToConfirm,
  };

  return {
    registrationTrend,
    statusDistribution,
    eventComparison,
    hourlyPattern,
    dayOfWeekPattern,
    conversionFunnel,
    heatmapData,
    radarData,
    statusTransitions,
    auditActivity,
    notificationStats,
    cohortData,
    topParticipants,
    geographicData,
    tipParticipantData,
    advancedMetrics,
    meta: {
      generatedAt: new Date().toISOString(),
      days,
      totalParticipantsInDb: allParticipants.length,
      totalEventsInDb: events.length,
    },
  };
}

// ---------------------------------------------------------------------------
// CACHE
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
      { data: allParticipants, error: e4 },
      { data: statusHistory, error: e5 },
      { data: auditLogs, error: e6 },
      { data: adminNotifications, error: e7 },
    ] = await Promise.all([
      // Participanți interval curent — coloane reale din schemă
      supabase
        .from("participants")
        .select("id, created_at, status, event_id, confirmed_at, email, nume, prenume, tip_participant, amount_paid")
        .gte("created_at", startISO)
        .lte("created_at", endDate),

      // Participanți interval anterior — pentru calcul growth
      supabase
        .from("participants")
        .select("status, created_at")
        .gte("created_at", prevStartISO)
        .lt("created_at", startISO),

      // Toate evenimentele
      supabase
        .from("events")
        .select("id, title, start_date, end_date, max_participants, price, currency, location, status"),

      // Toți participanții — pentru distribuție globală
      supabase
        .from("participants")
        .select("id, status, created_at, confirmed_at, event_id, email, nume, prenume, tip_participant, amount_paid"),

      // status_history — folosește changed_at (nu created_at!)
      supabase
        .from("status_history")
        .select("id, participant_id, old_status, new_status, changed_at, changed_by")
        .gte("changed_at", startISO)
        .lte("changed_at", endDate),

      // audit_logs — coloane reale: action, resource, severity (nu table_name/record_id)
      supabase
        .from("audit_logs")
        .select("id, action, created_at, user_id, user_email, resource, resource_id, severity")
        .gte("created_at", startISO)
        .lte("created_at", endDate),

            // admin_notifications — câmp read boolean (nu read_at/is_read!)
      supabase
        .from("admin_notifications")
        .select("id, type, title, message, event_id, participant_email, read, created_at")
        .gte("created_at", startISO)
        .lte("created_at", endDate),
    ]);

    if (e1) throw new Error(`participants: ${e1.message}`);
    if (e2) throw new Error(`prevParticipants: ${e2.message}`);
    if (e3) throw new Error(`events: ${e3.message}`);
    if (e4) throw new Error(`allParticipants: ${e4.message}`);
    if (e5) throw new Error(`status_history: ${e5.message}`);
    if (e6) throw new Error(`audit_logs: ${e6.message}`);
    if (e7) throw new Error(`admin_notifications: ${e7.message}`);

    return processAnalyticsData(
      participants ?? [],
      prevParticipants ?? [],
      events ?? [],
      allParticipants ?? [],
      statusHistory ?? [],
      auditLogs ?? [],
      adminNotifications ?? [],
      days
    );
  },
  ["admin-analytics-v3"],
  { revalidate: 3600, tags: ["charts"] }
);

// ---------------------------------------------------------------------------
// SERVER ACTIONS EXPORTATE
// ---------------------------------------------------------------------------

export async function getChartsData(
  days: number = 30
): Promise<{ success: true; data: ChartsData } | { success: false; error: string }> {
  try {
    await requireAdmin();
    const data = await getCachedAnalytics(days);
    return { success: true, data };
  } catch (err: any) {
    console.error("[getChartsData]", err);
    return { success: false, error: err.message ?? "Unknown error" };
  }
}

export async function refreshCharts(): Promise<
  { success: true } | { success: false; error: string }
> {
  try {
    await requireAdmin();
    revalidateTag("charts", "max");
    return { success: true };
  } catch (err: any) {
    console.error("[refreshCharts]", err);
    return { success: false, error: err.message ?? "Unknown error" };
  }
}