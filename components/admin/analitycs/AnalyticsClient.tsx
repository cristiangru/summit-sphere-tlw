"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  RefreshCcw, Download, ArrowUpRight, Lightbulb, 
  ChevronRight, TrendingUp, BarChart3, Activity
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getChartsData, refreshCharts, type ChartsData } from "@/src/server/actions/charts";
import { exportToExcel } from "@/lib/utils/exportAnalytics";

interface AnalyticsClientProps {
  initialData: ChartsData;
}

export default function AnalyticsClient({ initialData }: AnalyticsClientProps) {
  const router = useRouter();
  
  // States
  const [chartsData, setChartsData] = useState<ChartsData>(initialData);
  const [dateRange, setDateRange] = useState(30);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isChangingRange, setIsChangingRange] = useState(false);

  // Sincronizăm evenimentele selectate când se schimbă datele
  useEffect(() => {
    if (chartsData.eventComparison) {
      setSelectedEvents(chartsData.eventComparison.map(e => e.eventTitle));
    }
  }, [chartsData]);

  // Schimbarea intervalului de timp (Server Action apelat din Client)
  const handleRangeChange = async (days: number) => {
    if (days === dateRange) return;
    
    setIsChangingRange(true);
    setDateRange(days);
    
    const result = await getChartsData(days);
    if (result.success) {
      setChartsData(result.data);
    } else {
      console.error(result.error);
    }
    setIsChangingRange(false);
  };

  // Reîmprospătare forțată a cache-ului de pe server
  const handleManualRefresh = async () => {
    if (!window.confirm("Forțezi reîncărcarea datelor din baza de date?")) return;
    
    setIsRefreshing(true);
    const result = await refreshCharts();
    
    if (result.success) {
      router.refresh(); // Re-execută Server Component-ul (page.tsx)
      const freshData = await getChartsData(dateRange);
      if (freshData.success) setChartsData(freshData.data);
    } else {
      alert("Eroare la refresh: " + result.error);
    }
    setIsRefreshing(false);
  };

  const filteredEvents = useMemo(() => 
    chartsData.eventComparison.filter(e => selectedEvents.includes(e.eventTitle)),
    [chartsData, selectedEvents]
  );

  return (
    <div className="max-w-[1600px] mx-auto pt-10 px-4 md:px-10 pb-20 space-y-10">
      
      {/* HEADER DINAMIC */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200/60 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-indigo-600 rounded-[1.5rem] text-white shadow-xl shadow-indigo-200">
             <Activity size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Analytics <span className="text-indigo-600">Pro</span>
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
              Status: {isChangingRange ? "Actualizare..." : "Live"}
              <span className={`h-2 w-2 rounded-full ${isChangingRange ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all disabled:opacity-50"
          >
            <RefreshCcw size={14} className={isRefreshing ? "animate-spin" : ""} />
            Refresh Baza de Date
          </button>

          <div className="flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            {[7, 30, 90, 180].map((days) => (
              <button
                key={days}
                onClick={() => handleRangeChange(days)}
                className={`px-5 py-2 rounded-xl font-black text-[10px] uppercase transition-all ${
                  dateRange === days ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {days} Zile
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 transition-all duration-500 ${isChangingRange ? 'opacity-40 scale-95' : 'opacity-100'}`}>
        {Object.entries(chartsData.advancedMetrics).map(([key, value]) => (
          <div key={key} className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 truncate">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-black text-slate-900 dark:text-white leading-none">
                {value}{key.toLowerCase().includes("rate") ? "%" : ""}
              </p>
              <div className="p-2.5 bg-indigo-50 rounded-xl">
                <ArrowUpRight size={20} className="text-indigo-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <ChartCard 
            title="Evoluție Înscrieri" 
            subtitle="Date comparative zilnice"
            onExport={() => exportToExcel(chartsData.registrationTrend, "Trend", "DailyData")}
          >
            <SimpleLineChart data={chartsData.registrationTrend} />
          </ChartCard>
        </div>

        <div className="lg:col-span-4">
          <ChartCard title="Status Distribuție" subtitle="Procentaj global">
            <SimplePieChart data={chartsData.statusDistribution} />
          </ChartCard>
        </div>

        {/* COMPARARE EVENIMENTE */}
        <div className="lg:col-span-12">
          <ChartCard title="Performanță Evenimente" subtitle="Analiză volum participanți">
            <div className="flex flex-wrap gap-2 mb-10">
              {chartsData.eventComparison.map(e => (
                <button
                  key={e.eventTitle}
                  onClick={() => setSelectedEvents(prev => prev.includes(e.eventTitle) ? prev.filter(x => x !== e.eventTitle) : [...prev, e.eventTitle])}
                  className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${
                    selectedEvents.includes(e.eventTitle) 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" 
                    : "bg-white border-slate-100 text-slate-400 hover:border-indigo-100"
                  }`}
                >
                  {e.eventTitle}
                </button>
              ))}
            </div>
            <div className="space-y-8">
              {filteredEvents.map((item, idx) => (
                <HorizontalBar 
                  key={idx} 
                  label={item.eventTitle} 
                  value={item.totalParticipants} 
                  max={Math.max(...chartsData.eventComparison.map(e => e.totalParticipants), 1)} 
                />
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* FOOTER INSIGHTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard icon="🎯" title="Risc Churn" value={`${chartsData.advancedMetrics.churnRisk}%`} desc="Probabilitatea de abandon." />
        <InsightCard icon="⚡" title="Viteză Creștere" value={`+${chartsData.advancedMetrics.growthRate}%`} desc="Față de luna precedentă." />
        <InsightCard icon="👥" title="Total Real" value={chartsData.advancedMetrics.totalRegistrations.toLocaleString()} desc="Înregistrări procesate." />
        <InsightCard icon="🏆" title="Vârf Activitate" value={chartsData.advancedMetrics.peakDay} desc="Cea mai activă zi." />
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={() => exportToExcel(chartsData.registrationTrend, "Raport_Complet", "Analytics")}
          className="flex items-center gap-4 px-16 py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl shadow-2xl hover:bg-indigo-600 hover:-translate-y-1 transition-all active:scale-95"
        >
          <Download size={24} /> DESCARCĂ RAPORTUL (.XLSX)
        </button>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTE STILIZATE ---

function ChartCard({ title, subtitle, children, onExport }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200/60 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-10">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-400 font-medium">{subtitle}</p>
        </div>
        {onExport && (
          <button onClick={onExport} className="p-3.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
            <Download size={20} />
          </button>
        )}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

function InsightCard({ icon, title, value, desc }: any) {
  return (
    <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-indigo-100 transition-all">
      <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <p className="text-2xl font-black text-slate-900 mb-2">{value}</p>
      <p className="text-xs font-medium text-slate-500">{desc}</p>
    </div>
  );
}

function HorizontalBar({ label, value, max }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-[11px] font-black uppercase text-slate-600 truncate max-w-[80%]">{label}</span>
        <span className="text-indigo-600 font-black text-xs">{value}</span>
      </div>
      <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-1000 ease-out"
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

// --- GRAFICELE REUTILIZABILE (SimpleLineChart, SimplePieChart, etc.) ---
// Notă: Păstrează codul pentru graficele tale exact așa cum este în fișierul original, 
// ele funcționează perfect ca sub-componente în acest fișier.
// (Inclusiv SimpleLineChart, SimpleBarChart, SimplePieChart, SimpleFunnelChart)

function SimpleLineChart({ data }: { data: any[] }) {
  if (!data || !data.length) return <div className="h-64 flex items-center justify-center italic text-slate-400">Fără date</div>;
  const max = Math.max(...data.map(d => d.registrations), 1);

  return (
    <div className="h-[300px] flex items-end gap-1 px-1">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg z-30 pointer-events-none whitespace-nowrap shadow-xl">
            {d.registrations} Înscrieri
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
          </div>
          <div 
            className="w-full bg-indigo-500/10 group-hover:bg-indigo-500/40 rounded-t-xl transition-all duration-300 relative"
            style={{ height: `${(d.registrations / max) * 100}%` }}
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
          </div>
          <span className="text-[8px] font-black text-slate-400 mt-4">{d.date.split('-').reverse()[0]}</span>
        </div>
      ))}
    </div>
  );
}

function SimpleBarChart({ data, color }: { data: any[], color?: string }) {
  const max = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="h-64 overflow-x-auto">
      <div className="h-full min-w-[600px] flex items-end gap-2 pt-10">
        {data.map((d, i) => (
          <div key={i} className="flex-1 min-w-[16px] flex flex-col items-center group h-full justify-end relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-800 text-white text-[9px] font-black px-2 py-1 rounded-md z-30 whitespace-nowrap">
              {d.count} participanti
            </div>
            <div
              className={`w-full ${color || 'bg-indigo-500'} bg-opacity-10 group-hover:bg-opacity-100 rounded-t-xl transition-all duration-300 relative`}
              style={{ height: `${(d.count / max) * 100}%` }}
            />
            <span className="text-[9px] font-black text-slate-400 mt-4 uppercase tracking-tighter">{d.hour || d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimplePieChart({ data }: { data: any[] }) {
  const total = data.reduce((s, i) => s + i.count, 0);
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="transform -rotate-90 drop-shadow-2xl">
          {data.map((slice, i) => {
            const perc = slice.count / total;
            const x = 50 + 40 * Math.cos(2 * Math.PI * (offset + perc));
            const y = 50 + 40 * Math.sin(2 * Math.PI * (offset + perc));
            const startX = 50 + 40 * Math.cos(2 * Math.PI * offset);
            const startY = 50 + 40 * Math.sin(2 * Math.PI * offset);
            const pathData = `M 50 50 L ${startX} ${startY} A 40 40 0 ${perc > 0.5 ? 1 : 0} 1 ${x} ${y} Z`;
            offset += perc;
            return <path key={i} d={pathData} fill={slice.color} className="transition-all duration-300 hover:scale-[1.05] hover:opacity-90 origin-center cursor-pointer" />;
          })}
          <circle r="25" cx="50" cy="50" fill="white" className="dark:fill-slate-900" />
        </svg>
      </div>
      <div className="w-full space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-black text-slate-600 uppercase">{item.status}</span>
            </div>
            <span className="text-xs font-black">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimpleFunnelChart({ data }: { data: any[] }) {
  const colors = ["bg-slate-900", "bg-indigo-600", "bg-cyan-500"];
  return (
    <div className="space-y-6">
      {data.map((step, i) => (
        <div key={i} className="relative group">
          <div className="flex justify-between mb-3 items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{step.stage}</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">{step.count}</span>
          </div>
          <div className="h-16 w-full bg-slate-100 rounded-[1.25rem] relative overflow-hidden">
            <div 
              className={`h-full ${colors[i % 3]} transition-all duration-1000 ease-out flex items-center justify-end pr-6`}
              style={{ width: `${step.percentage}%` }}
            >
              <span className="text-white font-black text-xs">{step.percentage}%</span>
            </div>
          </div>
          {i < data.length - 1 && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-50">
               <ChevronRight className="rotate-90 text-slate-300" size={14} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}