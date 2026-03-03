// src/components/participants/ExportButtons.tsx - STANDALONE EXPORT COMPONENT
"use client";

import { Download } from "lucide-react";
import { ParticipantWithEvent } from "@/lib/types/participants";
import { 
  exportParticipantsToExcel, 
  exportEventParticipants 
} from "@/lib/utils/exportParticipants";
import { useToastContext } from "@/components/ToastProvider";

interface ExportButtonsProps {
  participants: ParticipantWithEvent[];
  eventTitle?: string;
}

export default function ExportButtons({ 
  participants, 
  eventTitle = "Eveniment" 
}: ExportButtonsProps) {
  const toast = useToastContext();

  const handleExportSimple = () => {
    try {
      if (participants.length === 0) {
        toast.error("Nu sunt participanți de exportat");
        return;
      }
      exportParticipantsToExcel(participants);
      toast.success("✓ Export simplificat completat");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Eroare necunoscută";
      toast.error(errorMessage);
    }
  };

  const handleExportComplete = () => {
    try {
      if (participants.length === 0) {
        toast.error("Nu sunt participanți de exportat");
        return;
      }
      exportEventParticipants(participants, eventTitle);
      toast.success("✓ Export complet cu rezumat completat");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Eroare necunoscută";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      {/* Export Complete */}
      <button
        onClick={handleExportComplete}
        className="flex-1 sm:flex-none px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-teal-500/30"
        title="Export cu statistici și rezumat"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export Complet</span>
        <span className="sm:hidden">Export Complet</span>
      </button>
      
      {/* Export Simple */}
      <button
        onClick={handleExportSimple}
        className="flex-1 sm:flex-none px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/30"
        title="Export simplificat CSV"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Export Simplu</span>
        <span className="sm:hidden">CSV</span>
      </button>
    </div>
  );
}