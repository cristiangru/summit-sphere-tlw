// src/app/admin/layout.tsx
import SidebarDemo from "@/components/admin/Sidebar";
import AdminLayoutClient from "./AdminLayoutClient";
import { AdminNotificationToast } from "@/components/admin/AdminNotificationToast";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

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
      <AdminNotificationToast />
    </AdminLayoutClient>
  );
}