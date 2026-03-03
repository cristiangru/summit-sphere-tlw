// src/components/participants/DeleteConfirmationModal.tsx
"use client";

import { X, AlertCircle, Loader2 } from "lucide-react";
import { ParticipantWithEvent } from "@/lib/types/participants";

interface DeleteConfirmationModalProps {
  participant: ParticipantWithEvent;
  isLoading: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function DeleteConfirmationModal({
  participant,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Șterge Participant
          </h2>
        </div>

        {/* Warning */}
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-4">
          <p className="text-sm text-red-700 dark:text-red-300">
            <span className="font-semibold">Atenție!</span> Această acțiune nu poate fi anulată. Toate datele participantului vor fi șterse permanent.
          </p>
        </div>

        {/* Participant Info */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Participant
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {participant.prenume} {participant.nume}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Email
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {participant.email}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
              Status
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 capitalize">
              {participant.status}
            </p>
          </div>
        </div>

        {/* Confirmation Message */}
        <div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
            Ești sigur că vrei să ștergi acest participant?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            Anulare
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Se șterge...
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4" />
                Șterge Participant
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}