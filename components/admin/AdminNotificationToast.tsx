// src/components/admin/AdminNotificationToast.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import { X, Bell, CheckCircle2, AlertCircle } from "lucide-react";
import { useAdminNotificationsFromDB } from "@/lib/hooks/useAdminNotify";

/**
 * Toast-uri fixe în colțul dreapta-sus.
 * Stau până adminul apasă X → delete din DB → dispar.
 * Nu are nevoie de context, state local, sau interval propriu.
 * Totul vine din useAdminNotificationsFromDB (React Query).
 */
export function AdminNotificationToast() {
  const { notifications, deleteNotif, markAsRead } = useAdminNotificationsFromDB();

  // Afișăm doar necitite, maxim 5, cele mai recente primele
  const visible = useMemo(
    () =>
      notifications
        .filter((n) => !n.read)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5),
    [notifications]
  );

  if (visible.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {visible.map((notif) => {
        const isRegistration = notif.type === "participant_registered";

        return (
          <div
            key={notif.id}
            className="pointer-events-auto w-80 rounded-2xl border-2 bg-white dark:bg-slate-900 border-teal-200 dark:border-teal-500/30 shadow-xl animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <div className="flex items-start gap-3 p-4">
              {/* Icon */}
              <div className="shrink-0 mt-0.5 text-xl">
                {isRegistration ? "📝" : "🔔"}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {notif.title}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {notif.message}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {formatTimeAgo(notif.created_at)}
                </p>

                {notif.action_url && (
                  <Link
                    href={notif.action_url}
                    onClick={() => markAsRead(notif.id)}
                    className="inline-block mt-2 px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    {notif.action_label || "Deschide"}
                  </Link>
                )}
              </div>

              {/* Close → delete din DB */}
              <button
                onClick={() => deleteNotif(notif.id)}
                className="shrink-0 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Închide"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTimeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Acum";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}z`;
}