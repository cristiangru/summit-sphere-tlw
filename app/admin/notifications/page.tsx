// src/app/admin/notifications/page.tsx (NEW - Dedicated notifications page)
"use client";

import { useAdminNotificationsFromDB } from "@/lib/hooks/useAdminNotify";
import { Bell, Check, Trash2, Archive, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/**
 * ============================================
 * NOTIFICATIONS PAGE
 * ============================================
 * Full-screen notifications management
 */

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    deleteNotif,
    clearAll,
    refetch,
  } = useAdminNotificationsFromDB();

  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">("all");

  // ✅ Filter notifications
  const filtered = notifications.filter((n) => {
    if (filterRead === "unread") return !n.read;
    if (filterRead === "read") return n.read;
    return true;
  });

  // ✅ Sort by newest first
  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-500/20 rounded-2xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                🔔 Notificări
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Gestiunează toate notificările tale
              </p>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={refetch}
            disabled={isLoading}
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
            title="Reîncarcă notificările"
          >
            <RefreshCw
              className={`w-5 h-5 text-slate-600 dark:text-slate-400 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total
            </p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {notifications.length}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-200 dark:border-red-500/30">
            <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Necitite
            </p>
            <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">
              {unreadCount}
            </p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl border border-emerald-200 dark:border-emerald-500/30">
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Citite
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {notifications.filter((n) => n.read).length}
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS & ACTIONS */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            {(["all", "unread", "read"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterRead(filter)}
                className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${
                  filterRead === filter
                    ? "bg-teal-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {filter === "all"
                  ? "Toate"
                  : filter === "unread"
                  ? "Necitite"
                  : "Citite"}
              </button>
            ))}
          </div>

          {/* Clear Button */}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg font-bold text-sm uppercase tracking-wider hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
            >
              Șterge toate
            </button>
          )}
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
            <Bell className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              Nu sunt notificări
            </p>
            <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">
              {filterRead === "all"
                ? "Revino mai târziu pentru actualizări"
                : filterRead === "unread"
                ? "Toate notificările au fost citite!"
                : "Nicio notificare citită încă"}
            </p>
          </div>
        ) : (
          sorted.map((notification) => (
            <div
              key={notification.id}
              className={`group p-5 rounded-2xl border-2 transition-all ${
                notification.read
                  ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800"
                  : "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-4xl mt-1 shrink-0">
                  {notification.type === "participant_registered" ? "📝" : "🔔"}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        {formatDate(notification.created_at)}
                      </p>

                      {/* Action Button */}
                      {notification.action_url && (
                        <Link
                          href={notification.action_url}
                          onClick={() => markAsRead(notification.id)}
                          className="inline-block mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-all"
                        >
                          {notification.action_label || "Deschide"}
                        </Link>
                      )}
                    </div>

                    {/* Status Badge */}
                    {notification.read && (
                      <div className="shrink-0">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
                          <Check className="w-3 h-3" />
                          Citit
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions - Visible on hover */}
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 hover:bg-blue-200 dark:hover:bg-blue-500/30 rounded-lg transition-colors"
                      title="Marchează ca citit"
                    >
                      <Check className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(notification.id)}
                    className="p-2 hover:bg-red-200 dark:hover:bg-red-500/30 rounded-lg transition-colors"
                    title="Șterge"
                  >
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  // Today
  if (date.toDateString() === now.toDateString()) {
    return `Astazi la ${date.toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Ieri la ${date.toLocaleTimeString("ro-RO", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // Older
  return date.toLocaleDateString("ro-RO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}