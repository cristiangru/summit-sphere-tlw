"use client";

import { Eye, Trash2, Download, ChevronUp, ChevronDown, Calendar, Check } from "lucide-react";
import { ParticipantWithEvent } from "@/lib/types/participants";
import { 
  exportEventParticipants,exportParticipantsMinimal
} from "@/lib/utils/exportParticipants";
import { useToastContext } from "@/components/ToastProvider";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface ParticipantsTableAdvancedProps {
  participants: ParticipantWithEvent[];
  title: string;
  showStatusFilter?: boolean;
  allowStatusChange?: boolean;
  onViewDetails: (participant: ParticipantWithEvent) => void;
  onDelete: (participant: ParticipantWithEvent) => void;
  onStatusChange?: (participantId: string, newStatus: string) => void;
}

const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG = {
  pending: { label: "Așteptând", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20", icon: "⏳" },
  confirmed: { label: "Confirmat", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20", icon: "✅" },
  cancelled: { label: "Anulat", color: "bg-red-100 text-red-700 dark:bg-red-500/20", icon: "❌" },
  "no-show": { label: "Absent", color: "bg-orange-100 text-orange-700 dark:bg-orange-500/20", icon: "⚠️" },
  attended: { label: "Prezent", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20", icon: "🎉" },
};

const STATUS_OPTIONS = [
  { value: "pending", label: "Așteptând", icon: "⏳" },
  { value: "confirmed", label: "Confirmat", icon: "✅" },
  { value: "attended", label: "Prezent", icon: "🎉" },
  { value: "no-show", label: "Absent", icon: "⚠️" },
  { value: "cancelled", label: "Anulat", icon: "❌" },
];

export default function ParticipantsTableAdvanced({
  participants,
  title,
  showStatusFilter = false,
  allowStatusChange = false,
  onViewDetails,
  onDelete,
  onStatusChange,
}: ParticipantsTableAdvancedProps) {
  const toast = useToastContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tipFilter, setTipFilter] = useState<"Fizica" | "Juridica" | "">("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [eventFilter, setEventFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "status" | "event">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const [statusMenuOpen, setStatusMenuOpen] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState<string | null>(null);

  // ✅ Extract unique events for filter
  const uniqueEvents = useMemo(() => {
    const eventMap = new Map();
    participants.forEach(p => {
      if (p.event_id && !eventMap.has(p.event_id)) {
        eventMap.set(p.event_id, p.event?.title || "Eveniment necunoscut");
      }
    });
    return Array.from(eventMap.entries()).map(([id, title]) => ({ id, title }));
  }, [participants]);

  const filtered = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch =
        `${p.prenume} ${p.nume}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.telefon && p.telefon.includes(searchTerm));

      const matchesTip = tipFilter === "" || p.tip_participant === tipFilter;
      const matchesStatus = statusFilter === "" || p.status === statusFilter;
      const matchesEvent = eventFilter === "" || p.event_id === eventFilter;

      return matchesSearch && matchesTip && matchesStatus && matchesEvent;
    });
  }, [participants, searchTerm, tipFilter, statusFilter, eventFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = `${a.prenume} ${a.nume}`.localeCompare(`${b.prenume} ${b.nume}`);
          break;
        case "date":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "event":
          comparison = (a.event?.title || "").localeCompare(b.event?.title || "");
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return copy;
  }, [filtered, sortBy, sortOrder]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedParticipants = sorted.slice(start, start + ITEMS_PER_PAGE);

  // ✅ Export
  const handleExportComplete = () => {
    try {
      if (filtered.length === 0) {
        toast.error("Nu sunt participanți de exportat");
        return;
      }
      const currentEvent = uniqueEvents.find(e => e.id === eventFilter);
      const exportTitle = currentEvent ? currentEvent.title : title || "Export Participanti";
      exportEventParticipants(filtered, exportTitle);
      toast.success("✓ Export complet realizat");
    } catch (error) {
      toast.error("Eroare la export");
    }
  };


const handleExportMinimal = () => {
  if (filtered.length === 0) {
    toast.error("Nu sunt participanți de exportat");
    return;
  }
  const currentEvent = uniqueEvents.find(e => e.id === eventFilter);
  const exportTitle = currentEvent ? currentEvent.title : "Participanti";
  exportParticipantsMinimal(filtered, exportTitle);
  toast.success("✓ Export simplificat descărcat");
};

  // ✅ DELETE
  const handleDeleteClick = (participant: ParticipantWithEvent) => setDeleteConfirmId(participant.id);

  const handleConfirmDelete = async () => {
    const participant = participants.find(p => p.id === deleteConfirmId);
    if (!participant) return;
    setIsDeleting(true);
    try {
      await onDelete(participant);
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error("Eroare la ștergere");
    } finally {
      setIsDeleting(false);
    }
  };

  // ✅ STATUS CHANGE (OPTIMIZED FOR INSTANT RESPONSE)
  const handleStatusChange = async (participantId: string, newStatus: string) => {
    if (!onStatusChange) {
      toast.error("Funcția de schimbare status nu este disponibilă");
      return;
    }

    // Închidem meniul IMEDIAT pentru feedback instant
    setStatusMenuOpen(null);
    setIsChangingStatus(participantId);

    try {
      // Deoarece folosim Optimistic Updates în hook, 
      // rândul se va muta/actualiza în milisecunde aici.
      await onStatusChange(participantId, newStatus);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Eroare la schimbarea status";
      toast.error(message);
    } finally {
      setIsChangingStatus(null);
    }
  };

  const participantToDelete = participants.find(p => p.id === deleteConfirmId);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {eventFilter ? `Eveniment: ${uniqueEvents.find(e => e.id === eventFilter)?.title}` : title}
            </h2>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
              Total : <span className="text-teal-600">{filtered.length}</span>
            </p>
          </div>
          <button
        onClick={handleExportMinimal}
        className="px-5 py-3 bg-teal-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:bg-teal-600 active:scale-95 shadow-lg"
      >
        <Download size={14} /> Export Listă
      </button>
          <button
            onClick={handleExportComplete}
            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 shadow-xl"
          >
            <Download size={16} /> Export Info
          </button>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Cauta participant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 px-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-teal-500 outline-none transition-all text-sm font-medium"
          />
        </div>
        
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="h-12 px-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 font-black text-[10px] uppercase tracking-widest outline-none focus:border-teal-500"
        >
          <option value="">Evenimente: Toate</option>
          {uniqueEvents.map(ev => (
            <option key={ev.id} value={ev.id}>{ev.title}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-12 px-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 font-black text-[10px] uppercase tracking-widest outline-none focus:border-teal-500"
        >
          <option value="">Status: Oricare</option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>

        <select
          value={tipFilter}
          onChange={(e) => setTipFilter(e.target.value as any)}
          className="h-12 px-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 font-black text-[10px] uppercase tracking-widest outline-none focus:border-teal-500"
        >
          <option value="">Tip Persoană</option>
          <option value="Fizica">Pers. Fizică</option>
          <option value="Juridica">Pers. Juridică</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-500">Participant</th>
                <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-500">Contact</th>
                <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-500">Tip</th>
                <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-500">
                  <button onClick={() => {setSortBy("event"); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}} className="flex items-center gap-1 hover:text-teal-500 transition-colors">
                    Eveniment {sortBy === "event" && (sortOrder === "asc" ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}
                  </button>
                </th>
                <th className="px-6 py-5 text-left text-[11px] font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-6 py-5 text-center text-[11px] font-black uppercase tracking-widest text-slate-500">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {paginatedParticipants.map((p) => {
                const cfg = STATUS_CONFIG[p.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
                const isThisChanging = isChangingStatus === p.id;

                return (
                  <tr key={p.id} className={cn(
                    "group transition-all duration-200",
                    isThisChanging ? "opacity-40 bg-slate-50 pointer-events-none" : "hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
                  )}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-black text-xs uppercase border border-teal-500/5">
                          {p.nume[0]}{p.prenume[0]}
                        </div>
                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{p.nume} {p.prenume}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-none mb-1 uppercase tracking-tighter">{p.email}</p>
                      <p className="text-xs font-black text-slate-700 dark:text-slate-200">{p.telefon || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                        p.tip_participant === 'Fizica' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                      )}>
                        {p.tip_participant === 'Fizica' ? 'PF' : 'PJ'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-[180px]">
                        <Calendar size={12} className="text-teal-500 shrink-0" />
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 truncate uppercase tracking-tight">
                          {p.event?.title || "N/A"}
                        </p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {allowStatusChange && onStatusChange ? (
                        <div className="relative">
                          <button
                            onClick={() => setStatusMenuOpen(statusMenuOpen === p.id ? null : p.id)}
                            className={cn(
                              "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all shadow-sm border border-transparent",
                              cfg.color,
                              statusMenuOpen === p.id && "ring-2 ring-teal-500/20 border-teal-500/20"
                            )}
                          >
                            <span className="flex items-center gap-1.5">
                              {cfg.icon} {cfg.label}
                            </span>
                            <ChevronDown size={12} className={cn("transition-transform", statusMenuOpen === p.id && "rotate-180")} />
                          </button>

                          {statusMenuOpen === p.id && (
                            <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.2rem] shadow-2xl z-[100] min-w-[180px] p-1.5 animate-in fade-in slide-in-from-top-2">
                              {STATUS_OPTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => handleStatusChange(p.id, option.value)}
                                  className={cn(
                                    "w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center gap-3 transition-all",
                                    p.status === option.value 
                                      ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" 
                                      : "hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                  )}
                                >
                                  <span className="text-base">{option.icon}</span>
                                  {option.label}
                                  {p.status === option.value && <Check size={12} className="ml-auto" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest", cfg.color)}>
                          {cfg.icon} {cfg.label}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => onViewDetails(p)} 
                          className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-teal-500 hover:text-white transition-all border border-slate-200 dark:border-slate-700"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(p)} 
                          className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100 dark:border-red-500/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-2 pt-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">
          Page {currentPage} of {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(c => c - 1)}
            className="h-11 px-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-slate-50 transition-all"
          >
            înapoi
          </button>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(c => c + 1)}
            className="h-11 px-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:opacity-90 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
          >
            înainte
          </button>
        </div>
      </div>

      {deleteConfirmId && participantToDelete && (
        <DeleteConfirmationModal
          participant={participantToDelete}
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}