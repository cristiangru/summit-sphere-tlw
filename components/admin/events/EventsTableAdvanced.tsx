// src/components/EventsTableAdvanced.tsx (OPTIMIZED - Instant delete)
"use client";

import { useState, useMemo, useCallback } from "react";
import { Eye, Search, ChevronLeft, ChevronRight, Calendar, MapPin, Users, Clock, Trash2 } from "lucide-react";
import { EnhancedEvent } from "@/lib/types/events";
import { useAdminNotificationsFromDB } from "@/lib/hooks/useAdminNotify";
import { deleteEvent } from "@/src/server/actions/events";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // ✅ You need: npm install sonner

interface EventsTableAdvancedProps {
  events: EnhancedEvent[];
  isLoading?: boolean;
  onViewParticipants: (eventId: string, eventTitle: string) => void;
  onEventDeleted?: (eventId: string) => void; // ✅ NEW: callback for parent to remove
}

const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG = {
  active: { label: "Activ", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400", icon: "🟢" },
  completed: { label: "Finalizat", color: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400", icon: "🔵" },
  cancelled: { label: "Anulat", color: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400", icon: "🔴" },
};

export default function EventsTableAdvanced({
  events,
  isLoading = false,
  onViewParticipants,
  onEventDeleted,
}: EventsTableAdvancedProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "active" | "completed" | "cancelled">("");
  const [sortBy, setSortBy] = useState<"title" | "startDate" | "participants">("startDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // ✅ OPTIMISTIC DELETE STATE
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [localEvents, setLocalEvents] = useState<EnhancedEvent[]>(events);

  // ✅ Sync local events with props when they change
  useMemo(() => {
    setLocalEvents(events);
  }, [events]);

  // ✅ Get notifications from database
  const { notifications, markAsRead } = useAdminNotificationsFromDB();

  // ✅ Count notifications per event
  const eventNotificationCount = useMemo(() => {
    const count: Record<string, number> = {};
    notifications.forEach((n) => {
      if (!n.read && n.event_id) {
        count[n.event_id] = (count[n.event_id] || 0) + 1;
      }
    });
    return count;
  }, [notifications]);

  // ✅ Get events with notifications
  const eventIdsWithNotifications = useMemo(() => {
    return new Set(Object.keys(eventNotificationCount));
  }, [eventNotificationCount]);

  // ✅ Handle view - Mark all notifications for this event as read
  const handleViewParticipants = useCallback((eventId: string, eventTitle: string) => {
    // ✅ Mark all unread notifications for this event as read
    notifications.forEach((notif) => {
      if (!notif.read && notif.event_id === eventId) {
        markAsRead(notif.id);
      }
    });

    // Call original handler
    onViewParticipants(eventId, eventTitle);
  }, [notifications, markAsRead, onViewParticipants]);

  // ✅ OPTIMISTIC DELETE - INSTANT UI UPDATE
  const handleDeleteEvent = useCallback(async (eventId: string, eventTitle: string) => {
    try {
      // ✅ OPTIMISTIC: Mark as deleting immediately
      setDeletingIds((prev) => new Set(prev).add(eventId));

      // ✅ Show loading toast
      const toastId = toast.loading(`Se șterge: ${eventTitle}...`);

      // Call server action
      const result = await deleteEvent(eventId);

      if (result.success) {
        // ✅ REMOVE FROM UI IMMEDIATELY
        setLocalEvents((prev) => prev.filter((e) => e.id !== eventId));
        
        // ✅ Notify parent component
        onEventDeleted?.(eventId);

        // ✅ Show success toast
        toast.success(`Eveniment șters: ${eventTitle}`, { id: toastId });
      } else {
        // ❌ REVERT if failed
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(eventId);
          return next;
        });

        // ✅ Show error toast
        toast.error(result.error || "Eroare la ștergere", { id: toastId });
      }
    } catch (err) {
      // ❌ REVERT if error
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });

      // ✅ Show error toast
      toast.error("Eroare la ștergere", { duration: 3000 });
      console.error("[DELETE] Error:", err);
    }
  }, [onEventDeleted]);

  // ✅ Filtrare
  const filtered = useMemo(() => {
    return localEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "" || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [localEvents, searchTerm, statusFilter]);

  // ✅ Sortare
  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "title": comparison = a.title.localeCompare(b.title); break;
        case "startDate": comparison = new Date(a.start_date).getTime() - new Date(b.start_date).getTime(); break;
        case "participants": comparison = (a.stats?.totalParticipants || 0) - (b.stats?.totalParticipants || 0); break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return copy;
  }, [filtered, sortBy, sortOrder]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEvents = sorted.slice(start, start + ITEMS_PER_PAGE);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "2-digit", month: "short", year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🟢 HEADER SECTION */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
              📅 evenimente
            </h2>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">
              Total: <span className="text-teal-600">{filtered.length}</span>
              {eventIdsWithNotifications.size > 0 && (
                <span className="ml-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs font-black tracking-wider">
                    <span className="animate-pulse">🔔</span>
                    {eventIdsWithNotifications.size} notificări
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 🟢 FILTERS BAR */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cauta titlu sau locatie..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-teal-500 outline-none transition-all font-medium"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as any); setCurrentPage(1); }}
          className="h-12 px-6 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 font-black text-[11px] uppercase tracking-widest outline-none focus:border-teal-500 lg:w-48"
        >
          <option value="">Status: Toate</option>
          <option value="active">🟢 Active</option>
          <option value="completed">🔵 Finalizate</option>
          <option value="cancelled">🔴 Anulate</option>
        </select>
      </div>

      {/* 🟢 TABLE / MOBILE CARDS CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        
        {/* DESKTOP TABLE VIEW (Visible from md up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-widest text-slate-500">
                <th className="px-6 py-5 text-left">
                   <button onClick={() => { setSortBy("title"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }} className="flex items-center gap-1 hover:text-teal-500">
                      Eveniment {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                   </button>
                </th>
                <th className="px-6 py-5 text-left">
                   <button onClick={() => { setSortBy("startDate"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }} className="flex items-center gap-1 hover:text-teal-500">
                      Inceput {sortBy === "startDate" && (sortOrder === "asc" ? "↑" : "↓")}
                   </button>
                </th>
                <th className="px-6 py-5 text-left">Sfarsit</th>
                <th className="px-6 py-5 text-left">Locatie</th>
                <th className="px-6 py-5 text-left">
                   <button onClick={() => { setSortBy("participants"); setSortOrder(sortOrder === "asc" ? "desc" : "asc"); }} className="flex items-center gap-1 hover:text-teal-500">
                      Participanti {sortBy === "participants" && (sortOrder === "asc" ? "↑" : "↓")}
                   </button>
                </th>
                <th className="px-6 py-5 text-left">Status</th>
                <th className="px-6 py-5 text-center">Actiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {paginatedEvents.map((event) => (
                <DesktopRow 
                  key={event.id} 
                  event={event} 
                  onView={handleViewParticipants}
                  onDelete={handleDeleteEvent}
                  formatDate={formatDate}
                  notificationCount={eventNotificationCount[event.id] || 0}
                  isDeleting={deletingIds.has(event.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARD VIEW (Visible only on small screens) */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {paginatedEvents.map((event) => (
            <MobileCard 
              key={event.id} 
              event={event} 
              onView={handleViewParticipants}
              onDelete={handleDeleteEvent}
              formatDate={formatDate}
              notificationCount={eventNotificationCount[event.id] || 0}
              isDeleting={deletingIds.has(event.id)}
            />
          ))}
        </div>

        {paginatedEvents.length === 0 && (
          <div className="p-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
            Niciun eveniment gasit.
          </div>
        )}
      </div>

      {/* 🟢 PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest order-2 sm:order-1">
            Pagina {currentPage} din {totalPages}
          </span>
          <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
              className="flex-1 sm:flex-none h-12 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              Inapoi
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
              className="flex-1 sm:flex-none h-12 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 disabled:opacity-30 transition-all shadow-lg shadow-slate-200 dark:shadow-none"
            >
              Inainte
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 📱 COMPONENTA PENTRU MOBIL (CARD)
function MobileCard({ event, onView, onDelete, formatDate, notificationCount, isDeleting }: any) {
  const cfg = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active;
  const hasNotification = notificationCount > 0;

  return (
    <div className={cn(
      "p-6 space-y-4 transition-all border-l-4",
      isDeleting && "opacity-50 pointer-events-none", // ✅ Visual feedback while deleting
      hasNotification 
        ? "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-500/10 dark:to-pink-500/10 border-l-red-500 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-500/20 dark:hover:to-pink-500/20" 
        : "bg-white dark:bg-slate-900 border-l-transparent hover:bg-slate-50 dark:hover:bg-slate-800/20"
    )}>
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-black text-sm shrink-0 uppercase">
              {event.title[0]}
            </div>
            {/* ✅ Beautiful notification badge with count */}
            {hasNotification && (
              <div className="absolute -top-3 -right-3 h-6 min-w-6 px-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-bounce">
                {notificationCount > 99 ? "99+" : notificationCount}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white uppercase leading-tight">{event.title}</h3>
            <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tighter ${cfg.color}`}>
              {cfg.icon} {cfg.label}
            </span>
          </div>
        </div>
        {/* ✅ Action buttons with optimistic delete */}
        <div className="flex gap-2">
          <button 
            onClick={() => onView(event.id, event.title)} 
            disabled={isDeleting}
            className="p-3 bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-500/20 hover:bg-teal-600 disabled:opacity-50 transition-all"
          >
            <Eye size={18} />
          </button>
          <button 
            onClick={() => onDelete(event.id, event.title)}
            disabled={isDeleting}
            className="p-3 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 disabled:opacity-50 transition-all"
          >
            {isDeleting ? <Clock size={18} className="animate-spin" /> : <Trash2 size={18} />}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Data Inceput</p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Calendar size={12} className="text-teal-500" /> {formatDate(event.start_date)}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Participanti</p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Users size={12} className="text-teal-500" /> {event.stats?.totalParticipants || 0} Inscriși
          </div>
        </div>
        <div className="col-span-2 space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Locatie</p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <MapPin size={12} className="text-teal-500" /> {event.location}
          </div>
        </div>
      </div>
    </div>
  );
}

// 💻 COMPONENTA PENTRU DESKTOP (ROW)
function DesktopRow({ event, onView, onDelete, formatDate, notificationCount, isDeleting }: any) {
  const cfg = STATUS_CONFIG[event.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active;
  const hasNotification = notificationCount > 0;

  return (
    <tr className={cn(
      "group transition-all border-l-4",
      isDeleting && "opacity-50", // ✅ Visual feedback while deleting
      hasNotification
        ? "bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-500/10 dark:to-pink-500/10 border-l-red-500 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-500/20 dark:hover:to-pink-500/20"
        : "border-l-transparent hover:bg-slate-50/80 dark:hover:bg-slate-800/30"
    )}>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-black text-xs shrink-0 uppercase border border-teal-500/10">
              {event.title[0]}
            </div>
            {/* ✅ Beautiful notification badge with count */}
            {hasNotification && (
              <div className="absolute -top-2.5 -right-2.5 h-5 min-w-5 px-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 animate-bounce">
                {notificationCount > 99 ? "99+" : notificationCount}
              </div>
            )}
          </div>
          <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[180px] uppercase tracking-tight">{event.title}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-300">{formatDate(event.start_date)}</td>
      <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-300">{formatDate(event.end_date)}</td>
      <td className="px-6 py-4">
        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate max-w-[150px]">{event.location}</p>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
          {event.stats?.totalParticipants || 0}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight", cfg.color)}>
          {cfg.icon} {cfg.label}
        </span>
      </td>
      <td className="px-6 py-4 text-center">
        {/* ✅ Action buttons with optimistic delete */}
        <div className="flex gap-2 justify-center">
          <button 
            onClick={() => onView(event.id, event.title)}
            disabled={isDeleting}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-teal-600 rounded-xl hover:bg-teal-500 hover:text-white hover:border-teal-500 disabled:opacity-50 transition-all shadow-sm"
          >
            <Eye size={16} />
          </button>
          {/* <button 
            onClick={() => onDelete(event.id, event.title)}
            disabled={isDeleting}
            className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-red-600 rounded-xl hover:bg-red-500 hover:text-white hover:border-red-500 disabled:opacity-50 transition-all shadow-sm"
          >
            {isDeleting ? <Clock size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button> */}
        </div>
      </td>
    </tr>
  );
}