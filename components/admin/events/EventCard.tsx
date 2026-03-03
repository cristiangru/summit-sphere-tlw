"use client";

import { 
  Edit2, MapPin, Trash2, Users, Copy, Check, Calendar, 
  Clock, MessageSquare, Banknote, FileDown, Activity, 
  TrendingUp, Hash 
} from "lucide-react";
import { EnhancedEvent } from "@/lib/types/events";
import { useChangeEventStatusMutation } from "@/lib/hooks/useEvents";
import { useToastContext } from "@/components/ToastProvider";
import { exportEventsToCSV } from "@/lib/utils/csvExport";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EventCardProps {
  event: EnhancedEvent;
  onEdit: (event: EnhancedEvent) => void;
  onDelete: (eventId: string) => void;
  onViewParticipants: (eventId: string) => void;
}

export default function EventCard({ event, onEdit, onDelete, onViewParticipants }: EventCardProps) {
  const router = useRouter();
  const toast = useToastContext();
  const statusMutation = useChangeEventStatusMutation();
  const [copiedId, setCopiedId] = useState(false);

  const registeredCount = event?.stats?.totalParticipants || 0;
  const occupancyPercentage = event?.stats?.occupancyRate || 0;
  const totalRevenue = registeredCount * (event?.price || 0);

  const handleExportIndividual = () => {
    try {
      exportEventsToCSV([event], `eveniment-${event.title.toLowerCase().replace(/\s+/g, '-')}`);
      toast.success("✓ Export individual reușit");
    } catch (err) {
      toast.error("Eroare la export");
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      await statusMutation.mutateAsync({ id: event.id, status: e.target.value as any });
      toast.success(`Status actualizat la ${e.target.value}`);
    } catch (err) {
      toast.error("Eroare la actualizare");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleTimeString("ro-RO", {
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden transition-all duration-300 hover:shadow-2xl">
      
      {/* 🟢 TOP RIGHT CORNER: Status indicator & ID */}
      <div className="absolute top-6 right-8 flex items-center gap-3 z-10">
        <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-100 dark:border-slate-700 shadow-sm">
          <span className={`h-2 w-2 rounded-full ${event.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          <button 
            onClick={() => { navigator.clipboard.writeText(event.id); setCopiedId(true); setTimeout(() => setCopiedId(false), 2000); }}
            className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5 hover:text-teal-600 transition-colors"
          >
            <Hash size={10} className="opacity-50" /> 
            {event.id.substring(0, 8)} 
            {copiedId && <Check size={10} className="text-emerald-600" />}
          </button>
        </div>
      </div>

      {/* 🟢 HEADER: Titlu & Selector Status */}
      <div className="p-8 pb-6 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="space-y-3 flex-1 pr-32"> {/* Padding right mare pentru a nu se suprapune cu ID-ul de sus */}
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
            {event.title}
          </h3>
          <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400">
            <MessageSquare size={16} className="mt-1 text-blue-500 shrink-0" />
            <p className="text-sm font-medium italic line-clamp-2">{event.description || "Fără descriere."}</p>
          </div>
        </div>

        <div className="pt-2 md:pt-8"> {/* Aliniat mai jos pentru a lăsa loc elementelor de sus */}
          <select 
            value={event.status} 
            onChange={handleStatusChange} 
            className="appearance-none px-6 py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest cursor-pointer focus:ring-2 focus:ring-teal-500 transition-all shadow-lg"
          >
            <option value="active">🟢 Active</option>
            <option value="completed">✅ Final</option>
            <option value="cancelled">🚫 Anulat</option>
          </select>
        </div>
      </div>

      {/* 🟢 INFO GRID: 4 columns */}
      <div className="px-8 pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* START DATE */}
        <div className="bg-emerald-50/50 dark:bg-emerald-500/5 p-5 rounded-[1.8rem] border border-emerald-100 dark:border-emerald-500/10">
          <div className="flex items-center gap-3 mb-3 text-emerald-600">
            <Calendar size={18} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60">Începe la</span>
          </div>
          <p className="text-base font-black text-slate-900 dark:text-white">{formatDate(event.start_date)}</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase">{formatTime(event.start_date)}</p>
        </div>

        {/* END DATE */}
        <div className="bg-orange-50/50 dark:bg-orange-500/5 p-5 rounded-[1.8rem] border border-orange-100 dark:border-orange-500/10">
          <div className="flex items-center gap-3 mb-3 text-orange-600">
            <Clock size={18} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-700/60">Se termină</span>
          </div>
          <p className="text-base font-black text-slate-900 dark:text-white">{formatDate(event.end_date)}</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase">{formatTime(event.end_date)}</p>
        </div>

        {/* LOCATION */}
        <div className="bg-blue-50/50 dark:bg-blue-500/5 p-5 rounded-[1.8rem] border border-blue-100 dark:border-blue-500/10">
          <div className="flex items-center gap-3 mb-3 text-blue-600">
            <MapPin size={18} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-700/60">Unde</span>
          </div>
          <p className="text-base font-black text-slate-900 dark:text-white truncate">{event.location || "Nespecificat"}</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase italic truncate">Locație stabilită</p>
        </div>

        {/* CAPACITY */}
        <div className="bg-purple-50/50 dark:bg-purple-500/5 p-5 rounded-[1.8rem] border border-purple-100 dark:border-purple-500/10">
          <div className="flex items-center gap-3 mb-3 text-purple-600">
            <Users size={18} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-700/60">Capacitate</span>
          </div>
          <p className="text-base font-black text-slate-900 dark:text-white">{event.max_participants || "∞"} Locuri</p>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase italic">Total locuri</p>
        </div>
      </div>

      {/* 🟢 STATS: Dark Dashboard Mode */}
      <div className="m-8 mt-6 p-6 bg-slate-850 dark:bg-slate-800 rounded-[2rem] grid grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Preț Bilet", val: `${event.price} ${event.currency}`, color: "text-black" },
          { label: "Înscriși", val: registeredCount, color: "text-blue-400" },
          { label: "Grad Ocupare", val: `${occupancyPercentage}%`, color: "text-purple-400" },
          { label: "Venit Est.", val: `${totalRevenue.toFixed(0)} ${event.currency}`, color: "text-emerald-400" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col gap-1 border-l border-slate-800 pl-4 first:border-none">
            <span className="text-[11px] font-black  tracking-widest text-slate-500">{stat.label}</span>
            <span className={`text-xl font-black ${stat.color} tracking-tight`}>{stat.val}</span>
          </div>
        ))}
      </div>

      {/* 🟢 FOOTER: Acțiuni */}
      <div className="px-8 pb-8 flex flex-wrap items-center gap-3">
        <button 
          onClick={() => onEdit(event)} 
          className="flex-1 md:flex-none px-8 h-14 bg-[#2D9A8F] hover:bg-[#257d74] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 active:scale-95"
        >
          <Edit2 size={16} /> Editează
        </button>

        <button 
          onClick={() => router.push(`/admin/participants?event=${event.id}`)} 
          className="flex-1 md:flex-none px-8 h-14 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-700 dark:text-white hover:border-blue-500 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-sm"
        >
          <Users size={18} /> Participanți
        </button>

        <div className="flex items-center gap-2 ml-auto">
          <button 
            onClick={handleExportIndividual} 
            className="w-14 h-14 flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-2xl hover:text-blue-500 transition-all border border-slate-100 dark:border-slate-700" 
            title="Export CSV"
          >
            <FileDown size={20} />
          </button>

          <button 
            onClick={() => onDelete(event.id)} 
            className="w-14 h-14 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all border border-red-100 dark:border-red-900/30" 
            title="Șterge"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}