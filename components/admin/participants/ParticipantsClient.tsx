// src/components/admin/participants/ParticipantsClient.tsx
// ✅ CLIENT COMPONENT — toată logica interactivă
// Primește date de pe server → React Query nu mai face fetch la mount
"use client";

import { useMemo, useState, useCallback } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToastContext } from "@/components/ToastProvider";
import {
  useParticipantsQuery,
  useUpdateParticipantStatusMutation,
  useDeleteParticipantMutation,
} from "@/lib/hooks/useParticipants";
import { useEventsWithStatsQuery } from "@/lib/hooks/useEvents";
import ParticipantsTableAdvanced from "@/components/admin/participants/ParticipantsTableAdvanced";
import EventsTableAdvanced from "@/components/admin/events/EventsTableAdvanced";
import ParticipantDetailsModal from "@/components/admin/participants/ParticipantDetailsModal";
import { ParticipantWithEvent } from "@/lib/types/participants";
import { EnhancedEvent } from "@/lib/types/events";

interface ParticipantsClientProps {
  initialEvents:       EnhancedEvent[];
  initialParticipants: ParticipantWithEvent[];
  initialEventId:      string;
  initialTotal:        number;
  initialPageSize:     number;
}

export function ParticipantsClient({
  initialEvents,
  initialParticipants,
  initialEventId,
  initialTotal,
  initialPageSize,
}: ParticipantsClientProps) {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const toast        = useToastContext();

  // ✅ eventId vine din URL — dacă userul navighează, se actualizează
  const eventId = searchParams.get("event") ?? initialEventId;

  // ✅ page vine din URL (implicit 1)
  const pageParam = searchParams.get("page");
  const initialPageFromUrl = pageParam ? parseInt(pageParam, 10) : 1;
  const [page, setPage] = useState(
    Number.isFinite(initialPageFromUrl) && initialPageFromUrl > 0
      ? initialPageFromUrl
      : 1
  );

  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantWithEvent | null>(null);

  // ✅ initialData → React Query folosește datele de pe server la mount
  // Nu face fetch până când staleTime expiră sau o mutație invalidează cache-ul
  const {
    data: participantsResult,
    isLoading: participantsLoading,
    isFetching: participantsFetching,
  } = useParticipantsQuery(eventId, page, {
    initialData:
      eventId === initialEventId && page === 1 ? initialParticipants : undefined,
    initialTotal:
      eventId === initialEventId && page === 1 ? initialTotal : undefined,
    initialPageSize:
      eventId === initialEventId && page === 1 ? initialPageSize : undefined,
  });

  const { data: allEventsData = initialEvents } = useEventsWithStatsQuery({
    initialData: initialEvents,
  });

  const allParticipants = Array.isArray(participantsResult?.participants)
    ? participantsResult!.participants
    : [];
  const allEvents       = Array.isArray(allEventsData)       ? allEventsData       : [];

  const totalParticipants = participantsResult?.total ?? allParticipants.length;
  const pageSize          =
    (participantsResult?.pageSize ?? allParticipants.length) || 1;
  const currentPage       = participantsResult?.page ?? page;
  const totalPages        = Math.max(
    1,
    Math.ceil(totalParticipants / (pageSize || 1))
  );

  // ✅ Filtrare locală — zero fetch-uri extra
  const pendingParticipants = useMemo(
    () => allParticipants.filter((p) => p.status === "pending"),
    [allParticipants]
  );

  const confirmedParticipants = useMemo(
    () => allParticipants.filter((p) => p.status !== "pending"),
    [allParticipants]
  );

  const activeEvent = useMemo(
    () => allEvents.find((e) => e.id === eventId),
    [allEvents, eventId]
  );

  // ✅ Mutații
  const statusMutation = useUpdateParticipantStatusMutation(eventId, currentPage);
  const deleteMutation = useDeleteParticipantMutation(eventId, currentPage);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleSelectEvent = useCallback(
    (id: string | null) => {
      if (id) {
        router.push(`/admin/participants?event=${id}&page=1`);
      } else {
        router.push("/admin/participants");
      }
      setPage(1);
    },
    [router]
  );

  const handleStatusChange = useCallback(
    async (participantId: string, newStatus: string) => {
      try {
        await statusMutation.mutateAsync({ participantId, newStatus });
      } catch {
        toast.error("Eroare la actualizarea statusului");
      }
    },
    [statusMutation, toast]
  );

  const handleDelete = useCallback(
    async (participant: ParticipantWithEvent) => {
      try {
        await deleteMutation.mutateAsync({
          participantId: participant.id,
          eventId:       participant.event_id,
        });
        toast.success("✓ Participant șters definitiv");
      } catch {
        toast.error("Eroare la ștergere");
      }
    },
    [deleteMutation, toast]
  );

  const handleViewDetails  = useCallback((p: ParticipantWithEvent) => setSelectedParticipant(p), []);
  const handleCloseModal   = useCallback(() => setSelectedParticipant(null), []);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      const safeNext = Math.min(
        Math.max(1, nextPage),
        totalPages > 0 ? totalPages : 1
      );
      setPage(safeNext);

      if (eventId) {
        const search = new URLSearchParams();
        search.set("event", eventId);
        search.set("page", String(safeNext));
        router.push(`/admin/participants?${search.toString()}`);
      }
    },
    [eventId, router, totalPages]
  );

  // ── Render ────────────────────────────────────────────────────────────────

  const showSkeleton =
    participantsLoading &&
    (!participantsResult || allParticipants.length === 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-10">
      <div className="relative max-w-7xl mx-auto space-y-8">

        {/* Overlay subtil pentru refetch în background */}
        {participantsFetching && !participantsLoading && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
            <div className="mt-2 flex items-center gap-2 rounded-full bg-slate-900/80 text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Se sincronizează participanții...</span>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="flex items-start md:items-center gap-5 mb-8">
          {eventId && (
            <button
              onClick={() => handleSelectEvent(null)}
              className="mt-1 p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm group"
            >
              <ChevronLeft className="w-6 h-6 text-slate-500 group-hover:text-teal-600 transition-colors" />
            </button>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="h-[2px] w-4 bg-teal-500 rounded-full" />
              <h1 className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                {eventId ? "📋 Gestiune Participanți" : "🎯 Dashboard Evenimente"}
              </h1>
            </div>
            {eventId ? (
              <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight leading-tight">
                {activeEvent?.title}
              </h2>
            ) : (
              <p className="text-xl md:text-2xl font-black text-slate-700 dark:text-slate-600 italic tracking-tight">
                Alege un eveniment pentru a vedea participanții
              </p>
            )}
          </div>
        </div>

        {/* CONTENT */}
        {!eventId ? (
          <EventsTableAdvanced
            events={allEvents}
            isLoading={false}
            onViewParticipants={handleSelectEvent}
          />
        ) : showSkeleton ? (
          <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="h-3 w-20 rounded-full bg-slate-100 dark:bg-slate-800" />
                  <div className="h-7 w-16 rounded-full bg-slate-200 dark:bg-slate-700" />
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="h-4 w-40 rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-40 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800" />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="h-4 w-64 rounded-full bg-slate-100 dark:bg-slate-800" />
              <div className="h-56 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800" />
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-500">

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Total"        value={totalParticipants}            color="slate"   />
              <StatCard label="În așteptare" value={pendingParticipants.length}   color="yellow"  />
              <StatCard label="Gestionați"   value={confirmedParticipants.length} color="emerald" />
            </div>

            {/* PENDING */}
            {pendingParticipants.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                  Cereri Noi
                </h2>
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 p-4">
                  <ParticipantsTableAdvanced
                    participants={pendingParticipants}
                    title=""
                    allowStatusChange={false}
                    onViewDetails={handleViewDetails}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            )}

            {/* CONFIRMED */}
            <div className="space-y-4">
              <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Listă Gestiune (Confirmați / Prezenți)
              </h2>
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 p-4">
                <ParticipantsTableAdvanced
                  participants={confirmedParticipants}
                  title=""
                  allowStatusChange={true}
                  onViewDetails={handleViewDetails}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />

                {/* PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="font-semibold">
                        Pagina {currentPage} din {totalPages}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">
                        ({totalParticipants} participanți în total)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Următor
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODAL */}
        {selectedParticipant && (
          <ParticipantDetailsModal
            participant={selectedParticipant}
            onClose={handleCloseModal}
            onParticipantUpdated={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
}

// ── Sub-componente ─────────────────────────────────────────────────────────

function StatCard({
  label, value, color,
}: {
  label: string;
  value: number;
  color: "slate" | "yellow" | "emerald";
}) {
  const colors = {
    slate:   "text-slate-900 dark:text-white",
    yellow:  "text-yellow-500",
    emerald: "text-emerald-500",
  };
  const labelColors = {
    slate:   "text-slate-400",
    yellow:  "text-yellow-500",
    emerald: "text-emerald-500",
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm">
      <p className={`text-[10px] font-black uppercase tracking-widest ${labelColors[color]}`}>
        {label}
      </p>
      <p className={`text-3xl font-black ${colors[color]}`}>{value}</p>
    </div>
  );
}