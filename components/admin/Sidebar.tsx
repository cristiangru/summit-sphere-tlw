// src/components/admin/Sidebar.tsx (FINAL - Badge only on Participants)
"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useAdminNotificationsFromDB } from "@/lib/hooks/useAdminNotify";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconChartBar,
  IconUserBolt,
  IconLogs,
  IconCalendarHeart,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const { unreadCount } = useAdminNotificationsFromDB(); // ✅ Get unread count

  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Events",
      href: "/admin/events",
      icon: (
        <IconCalendarHeart className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Participants",
      href: "/admin/participants",
      icon: (
        <div className="relative">
          <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
          {/* ✅ Red badge with unread count */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      ),
      badge: unreadCount > 0 ? unreadCount : null, // ✅ Also show in badge
    },
   {
      label: "Analytics",
      href: "/admin/analytics",
      icon: (
        <IconChartBar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },

    {
      label: "AuditLog",
      href: "/admin/audit-logs",
      icon: (
        <IconLogs className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        {/* Top Navigation Links */}
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>

        {/* Bottom: User Info + Logout */}
        <div className="space-y-4 border-t border-neutral-200 dark:border-neutral-800 pt-4">
          {/* User Profile Card */}
          <div className="px-2 py-4 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  {user?.firstName || "Admin"}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress || "admin@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <SignOutButton redirectUrl="/">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/30 transition-all group cursor-pointer">
              <IconArrowLeft className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400 group-hover:translate-x-[-2px] transition-transform" />
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {open ? "Logout" : ""}
              </span>
            </button>
          </SignOutButton>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

// Logo with text (shown when sidebar is expanded)
const Logo = () => (
  <Link
    href="/admin"
    className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white"
  >
    <div className="h-5 w-6 shrink-0 rounded-lg bg-[#2D9A8F]" />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-bold text-lg whitespace-pre text-[#2D9A8F]"
    >
      SummitSphere
    </motion.span>
  </Link>
);

// Logo icon (shown when sidebar is collapsed)
const LogoIcon = () => (
  <Link href="/admin" className="relative z-20 flex items-center py-1">
    <div className="h-5 w-6 shrink-0 rounded-lg bg-[#2D9A8F]" />
  </Link>
);