"use client";

import { useState, useMemo, useCallback } from "react";
import {
  RefreshCcw, Download, Activity, TrendingUp,
  Users, Calendar, MapPin, Bell, Shield,
  ArrowUpRight, ArrowDownRight, Minus, AlertTriangle,
  BarChart3, Clock, Zap, Target, Award, Eye, FileSpreadsheet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  getChartsData, refreshCharts,
  type ChartsData, type RegistrationTrendData,
  type StatusDistribution, type EventComparisonData,
  type HourlyRegistrationData, type DayOfWeekData,
  type ConversionFunnelData, type HeatmapDay,
  type RadarEventData, type StatusTransitionData,
  type AuditActivityData, type NotificationData,
  type ParticipantCohortData, type TopParticipantData,
  type GeographicData, type TipParticipantData,
} from "@/src/server/actions/charts";
import { exportAllAnalytics, exportSingleSheet } from "@/lib/utils/exportAnalytics";

interface AnalyticsClientProps { initialData: ChartsData; }

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b", confirmed: "#10b981", attended: "#3b82f6",
  "no-show": "#ef4444", cancelled: "#8b5cf6", rejected: "#f43f5e", waitlisted: "#06b6d4",
};

const DATE_RANGES = [
  { label: "7Z", days: 7 }, { label: "30Z", days: 30 },
  { label: "90Z", days: 90 }, { label: "180Z", days: 180 }, { label: "1An", days: 365 },
];

const COLOR_CLASSES: Record<string, { text: string; light: string }> = {
  indigo: { text: "text-indigo-600", light: "bg-indigo-50" },
  emerald: { text: "text-emerald-600", light: "bg-emerald-50" },
  rose: { text: "text-rose-600", light: "bg-rose-50" },
  amber: { text: "text-amber-600", light: "bg-amber-50" },
  sky: { text: "text-sky-600", light: "bg-sky-50" },
  violet: { text: "text-violet-600", light: "bg-violet-50" },
  orange: { text: "text-orange-600", light: "bg-orange-50" },
  teal: { text: "text-teal-600", light: "bg-teal-50" },
  pink: { text: "text-pink-600", light: "bg-pink-50" },
  lime: { text: "text-lime-600", light: "bg-lime-50" },
};

function fmtNum(n: number) {
  return n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);
}
function clamp(v: number, min = 0, max = 100) { return Math.min(max, Math.max(min, v)); }

export default function AnalyticsClient({ initialData }: AnalyticsClientProps) {
  const router = useRouter();
  const [data, setData] = useState<ChartsData>(initialData);
  const [dateRange, setDateRange] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState<string[]>(() =>
    initialData.eventComparison.slice(0, 5).map((e) => e.eventTitle)
  );

  const handleRangeChange = useCallback(async (days: number) => {
    if (days === dateRange) return;
    setIsLoading(true);
    setDateRange(days);
    const result = await getChartsData(days);
    if (result.success) {
      setData(result.data);
      setSelectedEvents(result.data.eventComparison.slice(0, 5).map((e) => e.eventTitle));
    }
    setIsLoading(false);
  }, [dateRange]);

  const handleRefresh = useCallback(async () => {
    if (!window.confirm("Forțezi reîncărcarea datelor din baza de date?")) return;
    setIsRefreshing(true);
    const result = await refreshCharts();
    if (result.success) {
      router.refresh();
      const fresh = await getChartsData(dateRange);
      if (fresh.success) setData(fresh.data);
    } else { alert("Eroare: " + result.error); }
    setIsRefreshing(false);
  }, [dateRange, router]);

  const handleExportAll = useCallback(async () => {
    setIsExporting(true);
    try { exportAllAnalytics(data); } finally { setIsExporting(false); }
  }, [data]);

  const handleExportSingle = useCallback((key: string) => {
    exportSingleSheet(key, data);
  }, [data]);

  const filteredEvents = useMemo(
    () => data.eventComparison.filter((e) => selectedEvents.includes(e.eventTitle)),
    [data, selectedEvents]
  );

  const m = data.advancedMetrics;

  const kpiCards = [
    { label: "Total Înregistrări", value: fmtNum(m.totalRegistrations), sub: `${m.growthRate > 0 ? "+" : ""}${m.growthRate}% vs. anterior`, icon: <Users size={20} />, trend: m.growthRate, color: "indigo" },
    { label: "Rată Prezență", value: `${m.avgAttendance}%`, sub: "Medie per eveniment", icon: <Target size={20} />, trend: m.avgAttendance - 50, color: "emerald" },
    { label: "Risc Abandon", value: `${m.churnRisk}%`, sub: "Participanți anulați", icon: <AlertTriangle size={20} />, trend: -m.churnRisk, color: "rose" },
    { label: "Venit Total", value: `${fmtNum(m.totalRevenue)} RON`, sub: `Preț mediu: ${m.avgPrice} RON`, icon: <Award size={20} />, trend: m.growthRate, color: "amber" },
    { label: "Fill Rate", value: `${m.avgFillRate}%`, sub: "Capacitate utilizată", icon: <BarChart3 size={20} />, trend: m.avgFillRate - 60, color: "sky" },
    { label: "Timp Confirmare", value: `${m.avgTimeToConfirm}h`, sub: "Înscriere → confirmare", icon: <Clock size={20} />, trend: m.avgTimeToConfirm < 24 ? 20 : -20, color: "violet" },
    { label: "No-Show Rate", value: `${m.noShowRate}%`, sub: "Din confirmați absenți", icon: <Eye size={20} />, trend: -m.noShowRate, color: "orange" },
    { label: "Audit Actions", value: fmtNum(m.totalAuditActions), sub: "Acțiuni înregistrate", icon: <Shield size={20} />, trend: 0, color: "teal" },
    { label: "Notificări Necitite", value: fmtNum(m.unreadNotifications), sub: "În intervalul selectat", icon: <Bell size={20} />, trend: -m.unreadNotifications, color: "pink" },
    { label: "Vârf Activitate", value: m.peakDay, sub: "Cea mai activă zi", icon: <Zap size={20} />, trend: 0, color: "lime" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 py-8 space-y-8">

        {/* HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
              <Activity size={26} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Analytics <span className="text-indigo-600">Dashboard</span>
              </h1>
              <p className="text-xs font-semibold text-slate-400 mt-0.5 flex items-center gap-2">
                {new Date(data.meta.generatedAt).toLocaleString("ro-RO")}
                <span className={`h-1.5 w-1.5 rounded-full inline-block ${isLoading ? "bg-amber-400 animate-pulse" : "bg-emerald-500"}`} />
                {isLoading ? "Se actualizează..." : "Live"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl gap-0.5 shadow-sm">
              {DATE_RANGES.map(({ label, days }) => (
                <button key={days} onClick={() => handleRangeChange(days)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition-all ${dateRange === days ? "bg-indigo-600 text-white shadow" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"}`}>
                  {label}
                </button>
              ))}
            </div>
            <button onClick={handleRefresh} disabled={isRefreshing}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black uppercase text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-50">
              <RefreshCcw size={13} className={isRefreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button onClick={handleExportAll} disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 disabled:opacity-50">
              <FileSpreadsheet size={13} className={isExporting ? "animate-pulse" : ""} />
              {isExporting ? "Se exportă..." : "Export Complet"}
            </button>
          </div>
        </header>

        {/* META BADGES */}
        <div className="flex flex-wrap gap-3 text-xs">
          {[
            { icon: <Users size={12} />, label: `${fmtNum(data.meta.totalParticipantsInDb)} participanți` },
            { icon: <Calendar size={12} />, label: `${data.meta.totalEventsInDb} evenimente` },
            { icon: <MapPin size={12} />, label: m.mostPopularLocation },
            { icon: <Shield size={12} />, label: `${m.totalAuditActions} acțiuni audit` },
          ].map((b, i) => (
            <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full font-semibold text-slate-600 dark:text-slate-300 shadow-sm">
              <span className="text-indigo-500">{b.icon}</span>{b.label}
            </span>
          ))}
        </div>

        {/* KPI GRID */}
        <section className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 transition-all duration-500 ${isLoading ? "opacity-40 scale-[0.99]" : ""}`}>
          {kpiCards.map((kpi, i) => {
            const c = COLOR_CLASSES[kpi.color];
            return (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 ${c.light} ${c.text} rounded-2xl group-hover:scale-110 transition-transform`}>{kpi.icon}</div>
                  <span className={`text-xs font-bold flex items-center gap-0.5 ${kpi.trend > 5 ? "text-emerald-500" : kpi.trend < -5 ? "text-rose-500" : "text-slate-400"}`}>
                    {kpi.trend > 5 ? <ArrowUpRight size={12} /> : kpi.trend < -5 ? <ArrowDownRight size={12} /> : <Minus size={12} />}
                    {Math.abs(kpi.trend)}
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none mb-1.5">{kpi.value}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-tight">{kpi.label}</p>
                <p className="text-[10px] text-slate-400 mt-1">{kpi.sub}</p>
              </div>
            );
          })}
        </section>

        {/* TREND + STATUS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ChartCard title="Evoluție Înregistrări" subtitle="Zilnic în intervalul selectat" icon={<TrendingUp size={18} />} onExport={() => handleExportSingle("trend")}>
              <RegistrationTrendChart data={data.registrationTrend} />
            </ChartCard>
          </div>
          <div className="lg:col-span-4">
            <ChartCard title="Distribuție Status" subtitle="Toți participanții" icon={<BarChart3 size={18} />} onExport={() => handleExportSingle("status")}>
              <StatusPieChart data={data.statusDistribution} />
            </ChartCard>
          </div>
        </div>

        {/* HEATMAP */}
        <ChartCard title="Heatmap Activitate" subtitle="Intensitate înregistrări pe calendar" icon={<Calendar size={18} />}>
          <HeatmapCalendar data={data.heatmapData} />
        </ChartCard>

        {/* FUNNEL + HOURLY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <ChartCard title="Conversion Funnel" subtitle="De la înregistrare la prezență" icon={<Target size={18} />} onExport={() => handleExportSingle("funnel")}>
              <FunnelChart data={data.conversionFunnel} />
            </ChartCard>
          </div>
          <div className="lg:col-span-7">
            <ChartCard title="Pattern Orar" subtitle="Distribuția înregistrărilor pe ore" icon={<Clock size={18} />} onExport={() => handleExportSingle("hourly")}>
              <BarChartHourly data={data.hourlyPattern} />
            </ChartCard>
          </div>
        </div>

        {/* DAY OF WEEK + RADAR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Activitate pe Zile" subtitle="Distribuție zilele săptămânii" icon={<BarChart3 size={18} />} onExport={() => handleExportSingle("dow")}>
            <DayOfWeekChart data={data.dayOfWeekPattern} />
          </ChartCard>
          <ChartCard title="Radar Performanță" subtitle="Top 6 evenimente comparate" icon={<Activity size={18} />}>
            <RadarChart data={data.radarData} />
          </ChartCard>
        </div>

        {/* TIP PARTICIPANT */}
        <ChartCard title="Tip Participant" subtitle="Distribuție PF / PJ / alte tipuri" icon={<Users size={18} />} onExport={() => handleExportSingle("tip")}>
          <TipParticipantChart data={data.tipParticipantData} />
        </ChartCard>

        {/* EVENT COMPARISON */}
        <ChartCard title="Performanță Evenimente" subtitle="Analiză detaliată per eveniment" icon={<Calendar size={18} />} onExport={() => handleExportSingle("events")}>
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => setSelectedEvents(data.eventComparison.map((e) => e.eventTitle))}
              className="px-3 py-1.5 text-[10px] font-black uppercase border-2 rounded-xl border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-600 transition-all">
              Toate
            </button>
            {data.eventComparison.map((e) => (
              <button key={e.eventTitle}
                onClick={() => setSelectedEvents((prev) => prev.includes(e.eventTitle) ? prev.filter((x) => x !== e.eventTitle) : [...prev, e.eventTitle])}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${selectedEvents.includes(e.eventTitle) ? "bg-indigo-600 border-indigo-600 text-white shadow" : "bg-white border-slate-200 text-slate-400 hover:border-indigo-200"}`}>
                {e.eventTitle.length > 22 ? e.eventTitle.slice(0, 20) + "…" : e.eventTitle}
              </button>
            ))}
          </div>
          <EventComparisonGrid events={filteredEvents} />
        </ChartCard>

        {/* STATUS TRANSITIONS + AUDIT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Tranziții Status" subtitle="Fluxul schimbărilor de stare" icon={<Activity size={18} />} onExport={() => handleExportSingle("transitions")}>
            <StatusTransitionChart data={data.statusTransitions} />
          </ChartCard>
          <ChartCard title="Activitate Audit" subtitle="Acțiuni admin pe zile" icon={<Shield size={18} />} onExport={() => handleExportSingle("audit")}>
            <AuditChart data={data.auditActivity} />
          </ChartCard>
        </div>

        {/* COHORT */}
        <ChartCard title="Retenție Cohort" subtitle="Activitate săptămânală pe cohortă" icon={<TrendingUp size={18} />} onExport={() => handleExportSingle("cohort")}>
          <CohortTable data={data.cohortData} />
        </ChartCard>

        {/* NOTIFICATIONS + GEOGRAPHIC */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Notificări Admin" subtitle="Tipuri și rate de citire" icon={<Bell size={18} />} onExport={() => handleExportSingle("notifications")}>
            <NotificationChart data={data.notificationStats} />
          </ChartCard>
          <ChartCard title="Distribuție Geografică" subtitle="Participanți per locație" icon={<MapPin size={18} />} onExport={() => handleExportSingle("geographic")}>
            <GeographicChart data={data.geographicData} />
          </ChartCard>
        </div>

        {/* TOP PARTICIPANTS */}
        <ChartCard title="Top Participanți" subtitle="Cei mai activi — minim 2 participări" icon={<Award size={18} />} onExport={() => handleExportSingle("top")}>
          <TopParticipantsTable data={data.topParticipants} />
        </ChartCard>

        {/* EXPORT FOOTER */}
        {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 pb-8">
      <button 
  onClick={handleExportAll} 
  disabled={isExporting}
  className="flex items-center gap-2.5 px-6 py-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-wide shadow-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
>
  <FileSpreadsheet size={18} className={isExporting ? "animate-pulse" : ""} />
  {isExporting ? "Se generează..." : "Export Complet (.XLSX)"}
</button>
          <p className="text-xs text-slate-400 font-medium">
            {data.meta.totalParticipantsInDb} participanți · {data.meta.totalEventsInDb} evenimente · {DATE_RANGES.find(r => r.days === dateRange)?.label}
          </p>
        </div> */}

      </div>
    </div>
  );
}

// ─── CHART CARD ───────────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children, icon, onExport }: {
  title: string; subtitle?: string; children: React.ReactNode;
  icon?: React.ReactNode; onExport?: () => void;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 rounded-3xl p-8 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          {icon && <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl flex-shrink-0">{icon}</div>}
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">{title}</h3>
            {subtitle && <p className="text-xs text-slate-400 font-medium mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {onExport && (
          <button onClick={onExport} title="Export Excel"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all uppercase tracking-wide">
            <Download size={12} />
            Excel
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ msg = "Fără date disponibile" }: { msg?: string }) {
  return (
    <div className="h-48 flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-2">
      <BarChart3 size={32} /><p className="text-sm font-medium">{msg}</p>
    </div>
  );
}

// ─── REGISTRATION TREND ───────────────────────────────────────────────────────

function RegistrationTrendChart({ data }: { data: RegistrationTrendData[] }) {
  if (!data.length) return <EmptyState />;
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.registrations), 1);
  const W = 800, H = 200, pad = { top: 20, right: 20, bottom: 40, left: 44 };
  const w = W - pad.left - pad.right, h = H - pad.top - pad.bottom;

  const pts = (key: "registrations" | "confirmed" | "cancelled") =>
    data.map((d, i) => {
      const x = pad.left + (i / Math.max(data.length - 1, 1)) * w;
      const y = pad.top + h - (d[key] / max) * h;
      return `${x},${y}`;
    }).join(" ");

  const LINES = [
    { key: "registrations" as const, color: "#6366f1", label: "Înregistrați" },
    { key: "confirmed" as const, color: "#10b981", label: "Confirmați" },
    { key: "cancelled" as const, color: "#f43f5e", label: "Anulați" },
  ];
  const step = Math.ceil(data.length / 10);

  return (
    <div>
      <div className="flex gap-6 mb-4">
        {LINES.map((l) => (
          <span key={l.key} className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
            <span className="w-5 h-1.5 rounded-full inline-block" style={{ backgroundColor: l.color }} />{l.label}
          </span>
        ))}
      </div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[400px]" style={{ height: H }}>
          {[0, 25, 50, 75, 100].map((pct) => {
            const y = pad.top + h - (pct / 100) * h;
            return (
              <g key={pct}>
                <line x1={pad.left} y1={y} x2={W - pad.right} y2={y} stroke="#e2e8f0" strokeWidth={0.5} />
                <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize={9} fill="#94a3b8">{Math.round((pct / 100) * max)}</text>
              </g>
            );
          })}
          {LINES.map((l) => (
            <polyline key={l.key} points={pts(l.key)} fill="none" stroke={l.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {data.map((d, i) => {
            const x = pad.left + (i / Math.max(data.length - 1, 1)) * w;
            return (
              <g key={i}>
                <rect x={x - 8} y={pad.top} width={16} height={h} fill="transparent"
                  onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: "crosshair" }} />
                {hovered === i && (
                  <>
                    <line x1={x} y1={pad.top} x2={x} y2={pad.top + h} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3,3" />
                    <rect x={Math.min(x - 60, W - 155)} y={pad.top} width={152} height={76} rx={8} fill="#1e293b" />
                    <text x={Math.min(x - 60, W - 155) + 10} y={pad.top + 16} fontSize={9} fill="#94a3b8">{d.date}</text>
                    <text x={Math.min(x - 60, W - 155) + 10} y={pad.top + 32} fontSize={10} fill="#a5b4fc">● {d.registrations} înregistrați</text>
                    <text x={Math.min(x - 60, W - 155) + 10} y={pad.top + 48} fontSize={10} fill="#6ee7b7">● {d.confirmed} confirmați</text>
                    <text x={Math.min(x - 60, W - 155) + 10} y={pad.top + 64} fontSize={10} fill="#fda4af">● {d.cancelled} anulați</text>
                  </>
                )}
              </g>
            );
          })}
          {data.map((d, i) => {
            if (i % step !== 0) return null;
            const x = pad.left + (i / Math.max(data.length - 1, 1)) * w;
            return <text key={i} x={x} y={H - 4} textAnchor="middle" fontSize={9} fill="#94a3b8">{d.date.slice(5)}</text>;
          })}
        </svg>
      </div>
    </div>
  );
}

// ─── STATUS PIE ───────────────────────────────────────────────────────────────

function StatusPieChart({ data }: { data: StatusDistribution[] }) {
  if (!data.length) return <EmptyState />;
  const total = data.reduce((s, i) => s + i.count, 0);
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-44 h-44">
        <svg viewBox="0 0 100 100" className="-rotate-90 drop-shadow-xl">
          {data.map((slice, i) => {
            const perc = total > 0 ? slice.count / total : 0;
            const startX = 50 + 40 * Math.cos(2 * Math.PI * offset);
            const startY = 50 + 40 * Math.sin(2 * Math.PI * offset);
            offset += perc;
            const endX = 50 + 40 * Math.cos(2 * Math.PI * offset);
            const endY = 50 + 40 * Math.sin(2 * Math.PI * offset);
            return <path key={i} d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${perc > 0.5 ? 1 : 0} 1 ${endX} ${endY} Z`} fill={slice.color} className="hover:opacity-80 cursor-pointer" />;
          })}
          <circle r={26} cx={50} cy={50} fill="white" className="dark:fill-slate-900" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{fmtNum(total)}</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase">total</span>
        </div>
      </div>
      <div className="w-full space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">{item.status}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-900 dark:text-white">{item.count}</span>
              <span className="text-[10px] text-slate-400 w-8 text-right">{item.percentage}%</span>
              <span className="text-xs">{item.trend === "up" ? "↑" : item.trend === "down" ? "↓" : "—"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HEATMAP ──────────────────────────────────────────────────────────────────

function HeatmapCalendar({ data }: { data: HeatmapDay[] }) {
  if (!data.length) return <EmptyState />;
  const [tooltip, setTooltip] = useState<{ date: string; count: number } | null>(null);
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const weeks = Math.max(...data.map((d) => d.week)) + 1;
  const grid: (HeatmapDay | null)[][] = Array.from({ length: weeks }, () => Array(7).fill(null));
  for (const d of data) { if (d.week < weeks && d.dayOfWeek < 7) grid[d.week][d.dayOfWeek] = d; }
  const getColor = (count: number) => {
    if (count === 0) return "#f1f5f9";
    const r = count / maxCount;
    if (r < 0.2) return "#c7d2fe"; if (r < 0.4) return "#a5b4fc";
    if (r < 0.6) return "#818cf8"; if (r < 0.8) return "#6366f1"; return "#4338ca";
  };
  const DAYS = ["D", "L", "Ma", "Mi", "J", "V", "S"];
  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-[10px] text-slate-400 font-medium">
        <span>Mai puțin</span>
        {["#f1f5f9", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4338ca"].map((c) => (
          <div key={c} className="w-4 h-4 rounded-sm" style={{ backgroundColor: c }} />
        ))}
        <span>Mai mult</span>
        {tooltip && <span className="ml-4 text-slate-600 dark:text-slate-300 font-bold">{tooltip.date}: {tooltip.count} înregistrări</span>}
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          <div className="flex flex-col gap-1 mr-1">
            <div className="h-4" />
            {DAYS.map((d) => <div key={d} className="h-5 w-5 text-[9px] text-slate-400 font-bold flex items-center justify-end pr-1">{d}</div>)}
          </div>
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              <div className="h-4 text-[8px] text-slate-400 text-center">
                {wi % 4 === 0 && data.find((d) => d.week === wi)?.date?.slice(5, 10)}
              </div>
              {DAYS.map((_, di) => {
                const cell = week[di];
                return (
                  <div key={di} className="w-5 h-5 rounded-sm transition-all hover:ring-2 hover:ring-indigo-400 cursor-default"
                    style={{ backgroundColor: getColor(cell?.count ?? 0) }}
                    onMouseEnter={() => cell && setTooltip({ date: cell.date, count: cell.count })}
                    onMouseLeave={() => setTooltip(null)} />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── FUNNEL ───────────────────────────────────────────────────────────────────

function FunnelChart({ data }: { data: ConversionFunnelData[] }) {
  if (!data.length) return <EmptyState />;
  const colors = ["#6366f1", "#10b981", "#3b82f6", "#f59e0b"];
  return (
    <div className="space-y-4">
      {data.map((step, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-300">{step.stage}</span>
            <div className="flex items-center gap-3">
              <span className="text-slate-900 dark:text-white font-black">{fmtNum(step.count)}</span>
              <span className="text-slate-400">{step.percentage}%</span>
              {step.dropOff > 0 && <span className="text-rose-400 text-[10px]">-{step.dropOff}%</span>}
            </div>
          </div>
          <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden">
            <div className="h-full rounded-2xl flex items-center justify-end pr-4 transition-all duration-1000"
              style={{ width: `${clamp(step.percentage)}%`, backgroundColor: colors[i % colors.length] }}>
              <span className="text-white text-[10px] font-black">{step.percentage}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── HOURLY BAR ───────────────────────────────────────────────────────────────

function BarChartHourly({ data }: { data: HourlyRegistrationData[] }) {
  if (!data.length) return <EmptyState />;
  const [hov, setHov] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="h-52 flex items-end gap-1">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center h-full justify-end relative">
          {hov === i && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none">{d.count}</div>
          )}
          <div className="w-full rounded-t-lg transition-all duration-200 cursor-pointer"
            style={{ height: `${(d.count / max) * 100}%`, backgroundColor: hov === i ? "#4338ca" : "#6366f1", minHeight: d.count > 0 ? 3 : 0, opacity: d.count === 0 ? 0.15 : 1 }}
            onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
          {i % 4 === 0 && <span className="text-[8px] text-slate-400 font-bold mt-1 tabular-nums">{d.hour.slice(0, 2)}</span>}
        </div>
      ))}
    </div>
  );
}

// ─── DAY OF WEEK ──────────────────────────────────────────────────────────────

function DayOfWeekChart({ data }: { data: DayOfWeekData[] }) {
  if (!data.length) return <EmptyState />;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-4">
          <span className="text-[11px] font-black text-slate-500 w-16 flex-shrink-0 uppercase tracking-wide">{d.day.slice(0, 3)}</span>
          <div className="flex-1 h-7 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
            <div className="h-full rounded-xl transition-all duration-700 flex items-center justify-end pr-3"
              style={{ width: `${(d.count / max) * 100}%`, background: "linear-gradient(90deg, #818cf8, #6366f1)", minWidth: d.count > 0 ? 28 : 0 }}>
              {d.count > 0 && <span className="text-white text-[9px] font-black">{d.count}</span>}
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-bold w-8 text-right">{d.percentage}%</span>
        </div>
      ))}
    </div>
  );
}

// ─── RADAR ────────────────────────────────────────────────────────────────────

function RadarChart({ data }: { data: RadarEventData[] }) {
  if (!data.length) return <EmptyState msg="Insuficiente date pentru radar" />;
  const axes = [
    { key: "conversionRate" as const, label: "Conversie" },
    { key: "attendanceRate" as const, label: "Prezență" },
    { key: "fillRate" as const, label: "Completare" },
    { key: "retentionScore" as const, label: "Retenție" },
    { key: "engagementScore" as const, label: "Engagement" },
  ];
  const N = axes.length, CX = 160, CY = 140, R = 100;
  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
  const angleOf = (i: number) => (2 * Math.PI * i) / N - Math.PI / 2;
  const polygonPoints = (item: RadarEventData) =>
    axes.map((ax, i) => { const v = clamp(item[ax.key]) / 100; const a = angleOf(i); return `${CX + R * v * Math.cos(a)},${CY + R * v * Math.sin(a)}`; }).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${CX * 2 + 60} ${CY * 2 + 20}`} className="w-full">
        {[20, 40, 60, 80, 100].map((pct) => (
          <polygon key={pct}
            points={axes.map((_, i) => { const a = angleOf(i); const r = R * pct / 100; return `${CX + r * Math.cos(a)},${CY + r * Math.sin(a)}`; }).join(" ")}
            fill="none" stroke="#e2e8f0" strokeWidth={0.5} />
        ))}
        {axes.map((ax, i) => {
          const a = angleOf(i);
          return (
            <g key={ax.key}>
              <line x1={CX} y1={CY} x2={CX + R * Math.cos(a)} y2={CY + R * Math.sin(a)} stroke="#e2e8f0" strokeWidth={0.5} />
              <text x={CX + (R + 16) * Math.cos(a)} y={CY + (R + 16) * Math.sin(a)} textAnchor="middle" dominantBaseline="middle" fontSize={9} fill="#64748b" fontWeight="700">{ax.label}</text>
            </g>
          );
        })}
        {data.map((item, idx) => (
          <polygon key={idx} points={polygonPoints(item)} fill={COLORS[idx % COLORS.length]} fillOpacity={0.15} stroke={COLORS[idx % COLORS.length]} strokeWidth={2} className="hover:fill-opacity-30 cursor-pointer transition-all" />
        ))}
      </svg>
      <div className="flex flex-wrap gap-3 mt-2">
        {data.map((item, idx) => (
          <span key={idx} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
            <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />{item.eventTitle}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── TIP PARTICIPANT ──────────────────────────────────────────────────────────

function TipParticipantChart({ data }: { data: TipParticipantData[] }) {
  if (!data.length) return <EmptyState msg="Fără date tip participant" />;
  const PALETTE = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];
  const max = data[0]?.count ?? 1;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data.map((item, i) => (
        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-black text-slate-700 dark:text-slate-200 capitalize">{item.tip}</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black" style={{ color: PALETTE[i % PALETTE.length] }}>{item.count}</span>
              <span className="text-xs font-bold text-slate-400">{item.percentage}%</span>
            </div>
          </div>
          <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(item.count / max) * 100}%`, backgroundColor: PALETTE[i % PALETTE.length] }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── EVENT COMPARISON ─────────────────────────────────────────────────────────

function EventComparisonGrid({ events }: { events: EventComparisonData[] }) {
  if (!events.length) return <EmptyState msg="Selectează cel puțin un eveniment" />;
  const maxTotal = Math.max(...events.map((e) => e.totalParticipants), 1);
  return (
    <div className="space-y-5">
      {events.map((ev, i) => (
        <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h4 className="font-black text-slate-900 dark:text-white text-sm">{ev.eventTitle}</h4>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin size={10} />{ev.location}{ev.startDate && <> · {new Date(ev.startDate).toLocaleDateString("ro-RO")}</>}{ev.price > 0 && <> · {ev.price} {ev.currency}</>}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: "Conversie", val: `${ev.conversionRate}%`, color: "#10b981" },
                { label: "Prezență", val: `${ev.attendanceRate}%`, color: "#3b82f6" },
                { label: "Fill", val: `${ev.fillRate}%`, color: "#6366f1" },
                { label: "Venit", val: `${fmtNum(ev.revenue)} RON`, color: "#f59e0b" },
              ].map((badge) => (
                <span key={badge.label} className="px-2.5 py-1 rounded-xl text-[10px] font-black text-white" style={{ backgroundColor: badge.color }}>
                  {badge.label}: {badge.val}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total", val: ev.totalParticipants, max: maxTotal, color: "#6366f1" },
              { label: "Confirmați", val: ev.confirmed, max: ev.totalParticipants || 1, color: "#10b981" },
              { label: "Prezenți", val: ev.attended, max: ev.confirmed || 1, color: "#3b82f6" },
              { label: "Anulați", val: ev.cancelled, max: ev.totalParticipants || 1, color: "#ef4444" },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-[10px] font-bold mb-1">
                  <span className="text-slate-500">{b.label}</span>
                  <span className="text-slate-900 dark:text-white">{b.val}</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${clamp((b.val / b.max) * 100)}%`, backgroundColor: b.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── STATUS TRANSITIONS ───────────────────────────────────────────────────────

function StatusTransitionChart({ data }: { data: StatusTransitionData[] }) {
  if (!data.length) return <EmptyState msg="Fără tranziții în acest interval" />;
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-3">
      {data.map((t, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 flex-shrink-0 w-44">
            <span className="px-2 py-0.5 rounded-lg text-[9px] font-black text-white" style={{ backgroundColor: STATUS_COLORS[t.from] ?? "#6b7280" }}>{t.from}</span>
            <span className="text-slate-300 text-xs">→</span>
            <span className="px-2 py-0.5 rounded-lg text-[9px] font-black text-white" style={{ backgroundColor: STATUS_COLORS[t.to] ?? "#6b7280" }}>{t.to}</span>
          </div>
          <div className="flex-1 h-5 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
            <div className="h-full rounded-xl transition-all duration-700 flex items-center justify-end pr-2"
              style={{ width: `${(t.count / max) * 100}%`, backgroundColor: STATUS_COLORS[t.to] ?? "#6b7280" }}>
              <span className="text-white text-[9px] font-black">{t.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── AUDIT CHART ──────────────────────────────────────────────────────────────

function AuditChart({ data }: { data: AuditActivityData[] }) {
  if (!data.length) return <EmptyState msg="Fără activitate audit" />;
  const maxVal = Math.max(...data.flatMap((d) => [d.logins, d.actions, d.errors]), 1);
  return (
    <div>
      <div className="flex gap-4 mb-4">
        {[{ color: "#6366f1", label: "Acțiuni" }, { color: "#10b981", label: "Login-uri" }, { color: "#ef4444", label: "Erori" }].map((l) => (
          <span key={l.label} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: l.color }} />{l.label}
          </span>
        ))}
      </div>
      <div className="h-44 flex items-end gap-0.5 overflow-x-auto">
        {data.map((d, i) => (
          <div key={i} className="flex-shrink-0 flex gap-0.5 items-end" style={{ minWidth: 12 }}>
            <div className="w-2 rounded-t-sm" style={{ height: `${(d.actions / maxVal) * 160}px`, backgroundColor: "#6366f1" }} />
            <div className="w-2 rounded-t-sm" style={{ height: `${(d.logins / maxVal) * 160}px`, backgroundColor: "#10b981" }} />
            <div className="w-2 rounded-t-sm" style={{ height: `${Math.max((d.errors / maxVal) * 160, d.errors > 0 ? 3 : 0)}px`, backgroundColor: "#ef4444" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COHORT TABLE ─────────────────────────────────────────────────────────────

function CohortTable({ data }: { data: ParticipantCohortData[] }) {
  if (!data.length) return <EmptyState msg="Date insuficiente pentru cohort" />;
  const getCellStyle = (val: number) => {
    if (val === 0) return "bg-slate-100 dark:bg-slate-800 text-slate-400";
    if (val >= 80) return "bg-indigo-700 text-white"; if (val >= 60) return "bg-indigo-500 text-white";
    if (val >= 40) return "bg-indigo-300 text-indigo-900"; if (val >= 20) return "bg-indigo-100 text-indigo-700";
    return "bg-slate-100 dark:bg-slate-800 text-slate-500";
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr>
            <th className="text-left text-[10px] font-black text-slate-400 uppercase pb-3 pr-4">Cohortă</th>
            {["Săpt 0", "Săpt 1", "Săpt 2", "Săpt 3", "Săpt 4"].map((w) => (
              <th key={w} className="text-center text-[10px] font-black text-slate-400 uppercase pb-3 px-2 w-20">{w}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td className="text-[11px] font-black text-slate-600 dark:text-slate-300 pr-4 py-1.5">{row.cohort}</td>
              <td className="px-1 py-1.5"><div className="text-center text-xs font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl py-1.5 px-2">{row.week0}</div></td>
              {[row.week1, row.week2, row.week3, row.week4].map((val, wi) => (
                <td key={wi} className="px-1 py-1.5">
                  <div className={`text-center text-xs font-black rounded-xl py-1.5 px-2 ${getCellStyle(val)}`}>{val > 0 ? `${val}%` : "—"}</div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── NOTIFICATION CHART ───────────────────────────────────────────────────────

function NotificationChart({ data }: { data: NotificationData[] }) {
  if (!data.length) return <EmptyState msg="Fără notificări în acest interval" />;
  return (
    <div className="space-y-4">
      {data.map((n, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-600 dark:text-slate-300 capitalize">{n.type.replace(/_/g, " ")}</span>
            <div className="flex items-center gap-3">
              <span className="text-slate-900 dark:text-white">{n.count} total</span>
              <span className="text-emerald-500">{n.readRate}% citite</span>
            </div>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700" style={{ width: `${n.readRate}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── GEOGRAPHIC CHART ─────────────────────────────────────────────────────────

function GeographicChart({ data }: { data: GeographicData[] }) {
  if (!data.length) return <EmptyState msg="Fără date de localizare" />;
  const max = data[0]?.count ?? 1;
  const PALETTE = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
  return (
    <div className="space-y-3">
      {data.slice(0, 10).map((loc, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: PALETTE[i % PALETTE.length] }}>
            <span className="text-white text-[8px] font-black">{i + 1}</span>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-700 dark:text-slate-200 truncate max-w-[60%]">{loc.location}</span>
              <span className="text-slate-500">{loc.count} · {loc.percentage}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(loc.count / max) * 100}%`, backgroundColor: PALETTE[i % PALETTE.length] }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TOP PARTICIPANTS ─────────────────────────────────────────────────────────

function TopParticipantsTable({ data }: { data: TopParticipantData[] }) {
  if (!data.length) return <EmptyState msg="Fără participanți cu multiple prezențe" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-800">
            {["#", "Nume", "Email", "Prezențe", "Rată Confirmare", "Ultima Activitate"].map((h) => (
              <th key={h} className="text-left text-[10px] font-black text-slate-400 uppercase pb-3 pr-6">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr key={i} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="py-3 pr-6">
                <span className={`text-xs font-black ${i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-orange-400" : "text-slate-300"}`}>
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </span>
              </td>
              <td className="py-3 pr-6"><span className="text-sm font-black text-slate-900 dark:text-white">{p.name}</span></td>
              <td className="py-3 pr-6"><span className="text-xs text-slate-400 font-medium">{p.email}</span></td>
              <td className="py-3 pr-6">
                <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-black rounded-xl">{p.eventsAttended}</span>
              </td>
              <td className="py-3 pr-6">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${p.confirmedRate}%` }} />
                  </div>
                  <span className="text-xs font-black text-slate-600 dark:text-slate-300">{p.confirmedRate}%</span>
                </div>
              </td>
              <td className="py-3 pr-6"><span className="text-xs text-slate-400">{p.lastSeen}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}