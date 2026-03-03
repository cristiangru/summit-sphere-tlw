// src/lib/hooks/useAdminNotificationsFromDB.ts
"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminNotifications,
  markNotificationAsRead,
  deleteNotification,
  clearAllNotifications,
} from "@/src/server/actions/notifications";

interface DatabaseNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  action_url?: string;
  action_label?: string;
  read: boolean;
  created_at: string;
  event_id?: string;
  participant_email?: string;
}

const NOTIFICATIONS_KEY = ["admin-notifications"] as const;

export const useAdminNotificationsFromDB = () => {
  const queryClient = useQueryClient();

  // ✅ React Query în loc de setInterval manual
  // refetchInterval: 30s în loc de 5s — notificările nu necesită real-time
  // refetchOnWindowFocus: false — nu re-fetch la alt-tab
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: async () => {
      const result = await getAdminNotifications();
      if (!result.success) return [];
      return (result.notifications || []) as DatabaseNotification[];
    },
    staleTime: 30 * 1000,          // 30s — folosește cache dacă datele sunt recente
    refetchInterval: 60 * 1000,    // ✅ poll la 60s, nu la 5s
    refetchOnWindowFocus: false,   // ✅ nu re-fetch la alt-tab
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ── Mutații cu optimistic update ─────────────────────────────────────────

  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData(NOTIFICATIONS_KEY);
      queryClient.setQueryData<DatabaseNotification[]>(
        NOTIFICATIONS_KEY,
        (old) => old?.map((n) => n.id === notificationId ? { ...n, read: true } : n)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY, exact: true }),
  });

  const deleteNotifMutation = useMutation({
    mutationFn: (notificationId: string) => deleteNotification(notificationId),
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData(NOTIFICATIONS_KEY);
      queryClient.setQueryData<DatabaseNotification[]>(
        NOTIFICATIONS_KEY,
        (old) => old?.filter((n) => n.id !== notificationId)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY, exact: true }),
  });

  const clearAllMutation = useMutation({
    mutationFn: clearAllNotifications,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const previous = queryClient.getQueryData(NOTIFICATIONS_KEY);
      queryClient.setQueryData(NOTIFICATIONS_KEY, []);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY, exact: true }),
  });

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY, exact: true });
  }, [queryClient]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead:  (id: string) => markAsReadMutation.mutate(id),
    deleteNotif: (id: string) => deleteNotifMutation.mutate(id),
    clearAll:    () => clearAllMutation.mutate(),
    refetch,
  };
};