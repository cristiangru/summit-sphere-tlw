// src/app/admin/page.tsx


import {
  Users, CheckCircle2, Clock, Calendar,
  TrendingUp, ArrowUpRight, AlertCircle,
  Download, Eye, Zap,
} from "lucide-react";
import { getDashboardAnalytics, type DashboardAnalytics } from "@/src/server/actions/analytics";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminPage() {
  const [userResult, analyticsResult] = await Promise.all([
    getCurrentUser().catch(() => null),
    getDashboardAnalytics(),
  ]);

  const userName = userResult?.firstName ?? null;

  if (!analyticsResult.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="font-bold text-red-600">{analyticsResult.error}</p>
      </div>
    );
  }

  const analytics = analyticsResult.data!;

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 pb-20">
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] p-10 shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tighter">
              Bine ai revenit,{" "}
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                {userName ?? "Admin"}
              </span>{" "}
              👋
            </h1>
            <p className="text-slate-700 dark:text-slate-300 font-medium">
              📊 Dashboard • {new Date().toLocaleDateString("ro-RO")}
            </p>
          </div>
          <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl flex items-center gap-2 transition-all shadow-lg">
            <Download size={18} /> Export Report
          </button>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Participanți"  value={analytics.totalParticipants}     icon={<Users className="w-6 h-6" />}       color="teal"    change="+8% vs last month"                          />
        <MetricCard title="Confirmații"         value={analytics.confirmedParticipants} icon={<CheckCircle2 className="w-6 h-6" />} color="emerald" change={`${analytics.overallConversionRate}% conversion`} />
        <MetricCard title="În Așteptare"        value={analytics.pendingParticipants}   icon={<Clock className="w-6 h-6" />}        color="amber"   change="Awaiting confirmation"                      />
        <MetricCard title="Evenimente Active"   value={analytics.activeEvents}          icon={<Zap className="w-6 h-6" />}          color="purple"  change={`${analytics.completedEvents} completed`}   />
      </div>

      {/* CONVERSION & ATTENDANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 mb-8">
            <TrendingUp className="text-teal-500" /> Rata de Conversie
          </h3>
          <div className="space-y-6">
            <div className="flex items-end gap-8">
              <div className="space-y-2">
                <p className="text-5xl font-black text-teal-600">{analytics.overallConversionRate}%</p>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  {analytics.confirmedParticipants} din {analytics.totalParticipants}
                </p>
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all"
                    style={{ width: `${analytics.overallConversionRate}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Țintă: 70% • Actual: {analytics.overallConversionRate}%
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <StatusBadge label="Confirmed" value={analytics.confirmedParticipants} color="emerald" />
              <StatusBadge label="Pending"   value={analytics.pendingParticipants}   color="amber"   />
              <StatusBadge label="Cancelled" value={analytics.cancelledParticipants} color="red"     />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 mb-8">
            <Eye className="text-blue-500" /> Rata de Prezență
          </h3>
          <div className="space-y-6">
            <div className="flex items-end gap-8">
              <div className="space-y-2">
                <p className="text-5xl font-black text-blue-600">{analytics.overallAttendanceRate}%</p>
                <p className="text-xs font-bold text-slate-400 uppercase">Participated</p>
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                    style={{ width: `${analytics.overallAttendanceRate}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Avg attendance rate across all events
                </p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4 text-sm">
              <p className="text-blue-900 dark:text-blue-300 font-medium">
                💡 Trimite reminder-uri cu 24h înainte pentru prezență mai bună
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* TOP EVENTS & UPCOMING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black uppercase tracking-tight mb-6">🏆 Top Evenimente</h3>
          <div className="space-y-4">
            {analytics.topEvents.length > 0 ? (
              analytics.topEvents.map((event, idx) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center font-bold text-teal-600 dark:text-teal-400">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{event.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{event.participantCount} participanți</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-teal-600">{event.conversionRate}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">conversion</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">No events yet</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-black uppercase tracking-tight mb-6">📅 Următoarele Evenimente</h3>
          <div className="space-y-4">
            {analytics.upcomingEvents.length > 0 ? (
              analytics.upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(event.startDate).toLocaleDateString("ro-RO")}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-bold">
                    {event.participantCount} înscriși
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">No upcoming events</p>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-black uppercase tracking-tight mb-6">⚡ Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionButton href="/admin/events"        label="Gestionează Evenimente" icon={<Calendar size={18} />}     />
          <ActionButton href="/admin/participants"  label="Vezi Participanți"       icon={<Users size={18} />}        />
          <ActionButton href="/admin/notifications" label="Notificări"              icon={<AlertCircle size={18} />}  />
        </div>
      </div>
    </div>
  );
}

// ── Sub-componente ─────────────────────────────────────────────────────────

function MetricCard({ title, value, icon, color, change }: {
  title: string; value: number; icon: React.ReactNode;
  color: "teal" | "emerald" | "amber" | "purple"; change: string;
}) {
  const colors = {
    teal:    "bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400",
    emerald: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    amber:   "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400",
    purple:  "bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400",
  };
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
      <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <p className="text-4xl font-black text-slate-900 dark:text-white mb-2">{value}</p>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{change}</p>
    </div>
  );
}

function StatusBadge({ label, value, color }: {
  label: string; value: number; color: "emerald" | "amber" | "red";
}) {
  const colors = {
    emerald: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    amber:   "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300",
    red:     "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300",
  };
  return (
    <div className={`p-3 rounded-lg text-center ${colors[color]}`}>
      <p className="text-xl font-black">{value}</p>
      <p className="text-xs font-bold uppercase">{label}</p>
    </div>
  );
}

function ActionButton({ href, label, icon }: {
  href: string; label: string; icon: React.ReactNode;
}) {
  return (
    <a href={href} className="group flex items-center justify-center gap-3 p-5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:from-teal-50 hover:to-emerald-50 dark:hover:from-teal-500/10 dark:hover:to-emerald-500/10 border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-500/50 rounded-2xl transition-all">
      <span className="group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-bold text-slate-900 dark:text-white">{label}</span>
      <ArrowUpRight size={16} className="text-slate-400 group-hover:text-teal-500 transition-colors" />
    </a>
  );
}