// src/app/admin/events/page.tsx
// ✅ SERVER COMPONENT — fetch pe server, date gata când pagina ajunge în browser

import { Suspense } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { getEventsWithStats } from "@/src/server/actions/events";
import { requireAdmin } from "@/lib/auth";
import { EventsClient } from "@/components/admin/events/EventsClient";
import { EnhancedEvent } from "@/lib/types/events";

async function EventsContent() {
  // ✅ Auth pe server — safe, folosește cookies()
  await requireAdmin();

  const result = await getEventsWithStats();

  if (!result.success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center space-y-4 bg-white dark:bg-slate-900 p-8 rounded-xl border border-red-200 dark:border-red-900">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Eroare la încărcarea evenimentelor
          </h2>
          <p className="text-slate-600 dark:text-slate-400">{result.error}</p>
        </div>
      </div>
    );
  }

  const initialEvents = (result.events ?? []) as EnhancedEvent[];

  // ✅ Date gata pe server → pasate ca prop → zero waterfall în browser
  return <EventsClient initialEvents={initialEvents} />;
}

export default function EventsPage() {
  return (

    
      <EventsContent />
   
  );
}