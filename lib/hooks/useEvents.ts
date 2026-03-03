// src/lib/hooks/useEvents.ts (BEST PRACTICE - Intelligent Caching)
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEventsWithStats,
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  changeEventStatus,
} from "@/src/server/actions/events";
import { EnhancedEvent } from "@/lib/types/events";

/**
 * ============================================
 * QUERY KEYS - Organized for cache management
 * ============================================
 */
const QUERY_KEYS = {
  // Admin dashboard
  eventsWithStats: ["events-with-stats"],
  
  // Public pages
  eventsList: ["events-list"],
  eventsList_page: (page: number) => ["events-list", page],
  event: (id: string) => ["event", id],
};

/**
 * ✅ ADMIN DASHBOARD: Get all events with stats
 * 
 * 🚀 OPTIMIZATION FEATURES:
 * - staleTime: 10 minutes (10 * 60 * 1000ms)
 * - gcTime: 30 minutes (keeps in memory for offline)
 * - Queries cached data for 10 mins, then soft-refetch
 * - If data is > 10 mins old, background refetch happens
 */

export const useEventsWithStatsQuery = (options?: { initialData?: EnhancedEvent[] }) => {
  return useQuery({
    queryKey: QUERY_KEYS.eventsWithStats,
    queryFn: async () => {
      const result = await getEventsWithStats();
      if (!result.success) throw new Error(result.error || "Failed to fetch events");
      return (result.events || []) as EnhancedEvent[];
    },
    initialData:    options?.initialData,
    staleTime:      options?.initialData ? 10 * 60 * 1000 : 10 * 60 * 1000,
    gcTime:         30 * 60 * 1000,
    retry:          2,
    refetchOnWindowFocus: false,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * ✅ PUBLIC: Get paginated events list
 */
export const useEventsQuery = (page = 1) => {
  return useQuery({
    queryKey: QUERY_KEYS.eventsList_page(page),
    queryFn: async () => {
      const result = await getEvents({ page });

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch events");
      }

      return result;
    },
    staleTime: 5 * 60 * 1000,        // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * ✅ PUBLIC: Get single event details
 */
export const useEventQuery = (eventId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.event(eventId),
    queryFn: async () => {
      if (!eventId) {
        throw new Error("Event ID is required");
      }

      const result = await getEventById(eventId);

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch event");
      }

      return result.event;
    },
    enabled: !!eventId,
    staleTime: 3 * 60 * 1000,        // 3 minutes
    gcTime: 5 * 60 * 1000,
  });
};

/**
 * ✅ CREATE EVENT (Admin)
 * 
 * Automatically invalidates cache after creation
 */
export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const result = await createEvent(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to create event");
      }
      return result;
    },
    onSuccess: () => {
      // ✅ Invalidate the admin dashboard cache
      // This causes a background refetch of fresh data
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.eventsWithStats 
      });
      // Also invalidate public list
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.eventsList 
      });
    },
  });
};

/**
 * ✅ UPDATE EVENT (Admin)
 */
export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: any) => {
      const result = await updateEvent(id, data);
      if (!result.success) {
        throw new Error(result.error || "Failed to update event");
      }
      return result;
    },
    onSuccess: (_, { id }) => {
      // Invalidate relevant caches
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.eventsWithStats 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.event(id) 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.eventsList 
      });
    },
  });
};

/**
 * ✅ DELETE EVENT (Admin)
 */
export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteEvent(id);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete event");
      }
      return result;
    },
    // ✅ Optimistic update pentru admin dashboard
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.eventsWithStats });

      const previousEvents =
        queryClient.getQueryData<EnhancedEvent[]>(QUERY_KEYS.eventsWithStats) ||
        [];

      queryClient.setQueryData<EnhancedEvent[]>(
        QUERY_KEYS.eventsWithStats,
        (old = []) => old.filter((e) => e.id !== id)
      );

      return { previousEvents };
    },
    onError: (_error, _id, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(
          QUERY_KEYS.eventsWithStats,
          context.previousEvents
        );
      }
    },
    onSettled: (_data, _error, id) => {
      // Sincronizăm cu serverul în fundal
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.eventsWithStats,
      });
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.event(id as string),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.eventsList,
      });
    },
  });
};

/**
 * ✅ CHANGE EVENT STATUS (Admin)
 */
export const useChangeEventStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      reason,
    }: {
      id: string;
      status: "active" | "cancelled" | "completed";
      reason?: string;
    }) => {
      const result = await changeEventStatus(id, status, reason);
      if (!result.success) {
        throw new Error(result.error || "Failed to change status");
      }
      return result;
    },
    // ✅ Optimistic update pentru status în admin dashboard
    onMutate: async ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "cancelled" | "completed";
    }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.eventsWithStats });

      const previousEvents =
        queryClient.getQueryData<EnhancedEvent[]>(QUERY_KEYS.eventsWithStats) ||
        [];

      queryClient.setQueryData<EnhancedEvent[]>(
        QUERY_KEYS.eventsWithStats,
        (old) =>
          old?.map((event) =>
            event.id === id ? { ...event, status } : event
          ) ?? old
      );

      return { previousEvents };
    },
    onError: (_error, _vars, context) => {
      if (context?.previousEvents) {
        queryClient.setQueryData(
          QUERY_KEYS.eventsWithStats,
          context.previousEvents
        );
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.eventsWithStats,
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.event(id),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.eventsList,
      });
    },
  });
};

/**
 * ✅ Manually refresh admin dashboard
 */
export const useRefreshEventsWithStats = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ 
      queryKey: QUERY_KEYS.eventsWithStats 
    });
  };
};

/**
 * ✅ Manually refresh public events list
 */
export const useRefreshEventsList = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ 
      queryKey: QUERY_KEYS.eventsList 
    });
  };
};