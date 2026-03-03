// src/app/admin/layout.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SidebarDemo from "@/components/admin/Sidebar";
import AdminLayoutClient from "./AdminLayoutClient";
import { AdminNotificationToast } from "@/components/admin/AdminNotificationToast";

// ✅ Scos: AdminNotificationProvider, AdminNotificationContext
// Toast-ul citește direct din React Query — nu mai e nevoie de context

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <AdminLayoutClient>
      <div className="flex flex-col md:flex-row h-screen w-full bg-white overflow-hidden">
        <SidebarDemo />
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-neutral-900">
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* ✅ Toast standalone — nu depinde de niciun context */}
      <AdminNotificationToast />
    </AdminLayoutClient>
  );
}