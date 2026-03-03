// src/components/events/DeleteConfirmationModal.tsx
"use client";

import { AlertCircle, Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  eventTitle: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({
  eventTitle,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl max-w-sm w-full text-center space-y-4 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            Ești sigur?
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Evenimentul "{eventTitle}" și toți participanții săi vor fi șterși definitiv.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 font-semibold bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm disabled:opacity-50"
          >
            Anulare
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-1.5 text-sm disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Șterge
          </button>
        </div>
      </div>
    </div>
  );
}