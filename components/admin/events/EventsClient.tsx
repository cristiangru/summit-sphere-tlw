// src/components/admin/events/EventsClient.tsx
// ✅ CLIENT COMPONENT — toată logica interactivă
// Primește initialEvents de pe server → React Query nu mai face fetch la mount
"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToastContext } from "@/components/ToastProvider";
import {
  useEventsWithStatsQuery,
  useDeleteEventMutation,
} from "@/lib/hooks/useEvents";
import EventsTabs from "@/components/admin/events/EventsTabs";
import EventCard from "@/components/admin/events/EventCard";
import EventForm from "@/components/admin/events/EventForm";
import DeleteConfirmationModal from "@/components/admin/events/DeleteConfirmationModal";
import { EnhancedEvent } from "@/lib/types/events";

const ITEMS_PER_PAGE = 3;

interface EventsClientProps {
  initialEvents: EnhancedEvent[];
}

export function EventsClient({ initialEvents }: EventsClientProps) {
  const router = useRouter();
  const toast  = useToastContext();

  // ✅ initialData → React Query folosește datele de pe server la mount
  // Nu face niciun fetch suplimentar până când staleTime expiră (10 minute)
  // sau până când o mutație invalidează cache-ul
  const {
    data: eventsData = initialEvents,
    error,
    refetch,
    isLoading,
    isFetching,
  } = useEventsWithStatsQuery({ initialData: initialEvents });

  const deleteMutation = useDeleteEventMutation();
  const events: EnhancedEvent[] = Array.isArray(eventsData) ? eventsData : [];

  // ── UI State ──────────────────────────────────────────────────────────────
  const [currentPage,    setCurrentPage]    = useState(1);
  const [showForm,       setShowForm]       = useState(false);
  const [editingEvent,   setEditingEvent]   = useState<EnhancedEvent | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed" | "cancelled">("active");

  // ── Derived data ──────────────────────────────────────────────────────────

  const sortedEvents = useMemo(
    () =>
      [...events].sort((a, b) => {
        const dateA = new Date(a.created_at || a.start_date || "").getTime();
        const dateB = new Date(b.created_at || b.start_date || "").getTime();
        return dateB - dateA;
      }),
    [events]
  );

  const filteredEvents = useMemo(
    () => activeTab === "all" ? sortedEvents : sortedEvents.filter((e) => e.status === activeTab),
    [sortedEvents, activeTab]
  );

  const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
  const safePage   = currentPage > totalPages && totalPages > 0 ? 1 : currentPage;

  const paginatedEvents = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEvents, safePage]);

  const tabStats = useMemo(() => ({
    all:       events.length,
    active:    events.filter((e) => e.status === "active").length,
    completed: events.filter((e) => e.status === "completed").length,
    cancelled: events.filter((e) => e.status === "cancelled").length,
  }), [events]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleOpenCreateForm = useCallback(() => {
    setEditingEvent(null);
    setShowForm(true);
  }, []);

  const handleEditEvent = useCallback((event: EnhancedEvent) => {
    setEditingEvent(event);
    setShowForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingEvent(null);
  }, []);

  const handleDeleteClick = useCallback((eventId: string) => {
    setDeleteConfirmId(eventId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirmId);
      toast.success("✓ Eveniment șters");
      setDeleteConfirmId(null);
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Eroare la ștergere");
    }
  }, [deleteConfirmId, deleteMutation, toast, refetch]);

  const handleViewParticipants = useCallback(
    (eventId: string) => router.push(`/admin/participants?event=${eventId}`),
    [router]
  );

  const handleTabChange = useCallback((tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  }, []);

  const eventToDelete = events.find((e) => e.id === deleteConfirmId) ?? null;

  // ── Error state ───────────────────────────────────────────────────────────

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4 bg-white dark:bg-slate-900 p-8 rounded-xl border border-red-200 dark:border-red-900">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Eroare la încărcarea evenimentelor
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {error instanceof Error ? error.message : "A apărut o eroare necunoscută"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-[#2D9A8F] text-white rounded-lg font-bold hover:bg-[#26897f] transition-all"
          >
            Reîncearcă
          </button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const showSkeleton = isLoading && events.length === 0;

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Overlay subtil când se face refetch în background */}
      {isFetching && !isLoading && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
          <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-900/80 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Se sincronizează evenimentele...</span>
          </div>
        </div>
      )}
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            📅 Evenimente
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {events.length} {events.length === 1 ? "eveniment" : "evenimente"} în total
          </p>
        </div>
        <button
          onClick={handleOpenCreateForm}
          className="flex items-center gap-2 rounded-lg bg-[#2D9A8F] px-5 py-2.5 font-medium text-white hover:bg-[#26897f] active:scale-[0.98] transition-all shadow-lg shadow-[#2D9A8F]/30"
        >
          <Plus size={18} />
          Eveniment nou
        </button>
      </div>

      {/* TABS */}
      {events.length > 0 && (
        <EventsTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          stats={tabStats}
          events={events}
        />
      )}

      {/* LIST / SKELETON / EMPTY STATE */}
      {showSkeleton ? (
        <div className="space-y-4">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6"
            >
              <div className="flex justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-1/3 rounded-full bg-slate-200 dark:bg-slate-700" />
                  <div className="h-4 w-2/3 rounded-full bg-slate-100 dark:bg-slate-800" />
                </div>
                <div className="h-10 w-32 rounded-2xl bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((__, i) => (
                  <div
                    key={i}
                    className="h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center">
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {events.length === 0 ? "📭 Încă nu ai evenimente" : "🔍 Niciun eveniment în această categorie"}
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            {events.length === 0
              ? "Creează primul tău eveniment și începe să colectezi înscriuri!"
              : "Schimbă filtrul pentru a vedea alte evenimente"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginatedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteClick}
                onViewParticipants={handleViewParticipants}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                aria-label="Pagina anterioară"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="min-w-[100px] text-center text-sm font-bold text-slate-900 dark:text-white">
                Pagina {safePage} din {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                aria-label="Pagina următoare"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* MODALS */}
      {showForm && (
        <EventForm
          event={editingEvent ?? undefined}
          onClose={handleCloseForm}
          onSuccess={() => {
            refetch();
            handleCloseForm();
            toast.success(editingEvent ? "✓ Eveniment actualizat" : "✓ Eveniment creat");
          }}
        />
      )}

      {deleteConfirmId && eventToDelete && (
        <DeleteConfirmationModal
          eventTitle={eventToDelete.title || "Evenimentul"}
          isLoading={deleteMutation.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}
    </div>
  );
}