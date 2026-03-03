// src/app/admin/participants/page.tsx
// ✅ SERVER COMPONENT — fetch pe server pentru events + participants

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getEventsWithStats } from "@/src/server/actions/events";
import { getParticipants } from "@/src/server/actions/participants";
import { requireAdmin } from "@/lib/auth";
import { ParticipantsClient } from "@/components/admin/participants/ParticipantsClient";
import { EnhancedEvent } from "@/lib/types/events";
import { ParticipantWithEvent } from "@/lib/types/participants";

interface ParticipantsContentProps {
  // eventId vine din searchParams — Next.js îl pasează automat
  searchParams: Promise<{ event?: string; page?: string }>;
}

async function ParticipantsContent({ searchParams }: ParticipantsContentProps) {
  // ✅ Auth pe server
  await requireAdmin();

  // ✅ Await searchParams (Next.js 15+ searchParams e async)
  const params  = await searchParams;
  const eventId = params.event ?? "";
  const pageParam = params.page ? parseInt(params.page, 10) : 1;
  const initialPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  // ✅ Fetch paralel pe server — events + participants simultan
  const [eventsResult, participantsResult] = await Promise.all([
    getEventsWithStats(),
    getParticipants(eventId, initialPage),
  ]);

  const initialEvents       = (eventsResult.success       ? eventsResult.events        ?? [] : []) as EnhancedEvent[];
  const initialParticipants = (participantsResult.success ? participantsResult.participants ?? [] : []) as ParticipantWithEvent[];
  const initialTotal        = participantsResult.success ? participantsResult.total     ?? initialParticipants.length : initialParticipants.length;
  const initialPageSize     = participantsResult.success ? participantsResult.pageSize  ?? initialParticipants.length : initialParticipants.length;

  return (
    <ParticipantsClient
      initialEvents={initialEvents}
      initialParticipants={initialParticipants}
      initialEventId={eventId}
      initialTotal={initialTotal}
      initialPageSize={initialPageSize}
    />
  );
}

export default function ParticipantsPage({
  searchParams,
}: {
  searchParams: Promise<{ event?: string; page?: string }>;
}) {
  return (

      <ParticipantsContent searchParams={searchParams} />

  );
}