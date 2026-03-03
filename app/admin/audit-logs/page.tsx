// src/app/admin/audit/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { getAuditLogs } from "@/src/server/actions/participants";
import AuditLogsClient from "@/components/admin/audit-log/AuditLogsClient";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Jurnal Audit | Admin Panel",
};

export default async function AuditLogsPage() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses[0]?.emailAddress || "unknown_admin";

  // Preluăm datele direct pe server
  const result = await getAuditLogs(userEmail);

  if (!result.success) {
    return (
      <div className="p-10 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-slate-900">Eroare la încărcarea datelor</h1>
        <p className="text-slate-500">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Jurnal Audit</h1>
          <p className="text-slate-500 text-sm font-medium">
            Monitorizare în timp real: {userEmail}
          </p>
        </div>
      </div>

      {/* Pasăm datele către componenta de client pentru filtrare și UI */}
      <AuditLogsClient initialLogs={result.logs || []} />
    </div>
  );
}