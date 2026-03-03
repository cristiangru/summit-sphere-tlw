// src/components/admin/events/EventsTabs.tsx
"use client";

import { FileDown } from "lucide-react";
import { EnhancedEvent } from "@/lib/types/events";
import { useToastContext } from "@/components/ToastProvider";
import { exportEventsToCSV } from "@/lib/utils/csvExport";

interface EventsTabsProps {
  activeTab: "active"| "all" | "completed" | "cancelled"; 
  onTabChange: (tab: "all" | "active" | "completed" | "cancelled") => void;
  stats: { all: number; active: number; completed: number; cancelled: number; };
  events?: EnhancedEvent[];
}

// ✅ Reordonat: "active" este primul vizual
const TABS = [
  { value: "active", label: "Active", color: "bg-emerald-600 shadow-emerald-200/50 dark:shadow-emerald-900/30" },
  { value: "all", label: "Toate", color: "bg-slate-700 shadow-slate-200/50 dark:shadow-slate-900/30" },
  { value: "completed", label: "Finalizate", color: "bg-blue-600 shadow-blue-200/50 dark:shadow-blue-900/30" },
  { value: "cancelled", label: "Anulate", color: "bg-red-600 shadow-red-200/50 dark:shadow-red-900/30" },
] as const;

export default function EventsTabs({ activeTab, onTabChange, stats, events = [] }: EventsTabsProps) {
  const toast = useToastContext();

  const handleExportAll = () => {
    try {
      if (!events.length) return toast.error("Nu sunt evenimente");
      exportEventsToCSV(events, "export-general-evenimente");
      toast.success("✓ Export CSV completat");
    } catch (err) {
      toast.error("Eroare la export");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-2 group relative ${
                isActive 
                  ? `${tab.color} text-white shadow-lg scale-[1.05]` 
                  : "bg-slate-50 dark:bg-slate-800/40 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700"
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                isActive 
                  ? "bg-white/20 text-white" 
                  : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300"
              }`}>
                {stats[tab.value]}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={handleExportAll}
        disabled={events.length === 0}
        className="w-full md:w-auto px-6 h-11 bg-teal-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-500/20 transition-all disabled:opacity-50 active:scale-95"
      >
        <FileDown className="w-4 h-4" />
        Export CSV (Total)
      </button>
    </div>
  );
}