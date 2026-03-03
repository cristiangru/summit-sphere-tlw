"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getParticipants,
  updateParticipantStatus,
  deleteParticipant,
} from "@/src/server/actions/participants";
import { ParticipantWithEvent, ParticipantStats } from "@/lib/types/participants";

type ParticipantStatus = "pending" | "confirmed" | "attended" | "no-show" | "cancelled";

// ---------------------------------------------------------------------------
// QUERY KEYS
// ---------------------------------------------------------------------------

export const participantKeys = {
  root: ["participants"] as const,
  list: (eventId: string, page: number = 1) =>
    ["participants", eventId || "all", page] as const,
};

// ---------------------------------------------------------------------------
// TYPE — Rezultat query participants cu meta de paginare
// ---------------------------------------------------------------------------

export interface ParticipantsQueryResult {
  participants: ParticipantWithEvent[];
  total: number;
  page: number;
  pageSize: number;
}

// ---------------------------------------------------------------------------
// UN SINGUR HOOK DE FETCH
// Filtrarea (pending / confirmed) se face în componentă cu useMemo.
// Acceptă paginare (page), dar UI poate folosi sau ignora.
// ---------------------------------------------------------------------------

export const useParticipantsQuery = (
  eventId: string = "",
  page: number = 1,
  options?: {
    initialData?: ParticipantWithEvent[];
    initialTotal?: number;
    initialPageSize?: number;
  }
) => {
  return useQuery<ParticipantsQueryResult>({
    queryKey: participantKeys.list(eventId, page),
    queryFn: async () => {
      const result = await getParticipants(eventId, page);
      if (!result.success || !result.participants)
        throw new Error(result.error || "Error fetching participants");

      const participants = result.participants as ParticipantWithEvent[];

      return {
        participants,
        total: result.total ?? participants.length,
        page: result.page ?? page,
        pageSize: result.pageSize ?? participants.length,
      };
    },
    initialData: options?.initialData
      ? {
          participants: options.initialData,
          total: options.initialTotal ?? options.initialData.length,
          page,
          pageSize: options.initialPageSize ?? options.initialData.length,
        }
      : undefined,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

// ---------------------------------------------------------------------------
// MUTATION — UPDATE STATUS (cu optimistic update, pe pagina curentă)
// ---------------------------------------------------------------------------

export const useUpdateParticipantStatusMutation = (
  eventId: string = "",
  page: number = 1
) => {
  const queryClient = useQueryClient();
  const baseKey = ["participants", eventId || "all"] as const;
  const pageKey = participantKeys.list(eventId, page);

  return useMutation({
    mutationFn: async ({
      participantId,
      newStatus,
    }: {
      participantId: string;
      newStatus: string;
    }) => {
      const result = await updateParticipantStatus(participantId, newStatus);
      if (!result.success) throw new Error(result.error);
      return result;
    },

    onMutate: async ({ participantId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: pageKey });

      const previous =
        queryClient.getQueryData<ParticipantsQueryResult>(pageKey);

      queryClient.setQueryData<ParticipantsQueryResult>(pageKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          participants: old.participants.map((p) =>
            p.id === participantId
              ? { ...p, status: newStatus as ParticipantStatus }
              : p
          ),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(pageKey, context.previous);
      }
    },

    onSettled: () => {
      // invalidează toate paginile pentru evenimentul curent
      queryClient.invalidateQueries({
        queryKey: baseKey,
      });
    },
  });
};

// ---------------------------------------------------------------------------
// MUTATION — DELETE (cu optimistic update, pe pagina curentă)
// ---------------------------------------------------------------------------

export const useDeleteParticipantMutation = (
  eventId: string = "",
  page: number = 1
) => {
  const queryClient = useQueryClient();
  const baseKey = ["participants", eventId || "all"] as const;
  const pageKey = participantKeys.list(eventId, page);

  return useMutation({
    mutationFn: async ({
      participantId,
      eventId: evId,
    }: {
      participantId: string;
      eventId: string;
    }) => {
      const result = await deleteParticipant(participantId, evId);
      if (!result.success) throw new Error(result.error);
      return result;
    },

    onMutate: async ({ participantId }) => {
      await queryClient.cancelQueries({ queryKey: pageKey });

      const previous =
        queryClient.getQueryData<ParticipantsQueryResult>(pageKey);

      queryClient.setQueryData<ParticipantsQueryResult>(pageKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          participants: old.participants.filter((p) => p.id !== participantId),
          total: Math.max(0, (old.total || 0) - 1),
        };
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(pageKey, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: baseKey,
      });
    },
  });
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

export const calculateParticipantStats = (
  participants: ParticipantWithEvent[]
): ParticipantStats => ({
  total:     participants.length,
  confirmed: participants.filter((p) => p.status === "confirmed").length,
  pending:   participants.filter((p) => p.status === "pending").length,
  cancelled: participants.filter((p) => p.status === "cancelled").length,
  attended:  participants.filter((p) => p.status === "attended").length,
  noShow:    participants.filter((p) => p.status === "no-show").length,
});