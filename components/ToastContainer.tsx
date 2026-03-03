// src/components/toast/ToastContainer.tsx
"use client";

import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { Toast } from "@/lib/hooks/useToast";

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div
            className={`px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 backdrop-blur-sm border ${
              toast.type === "success"
                ? "bg-emerald-500/95 text-white border-emerald-400/50 dark:bg-emerald-600/95"
                : toast.type === "error"
                ? "bg-red-500/95 text-white border-red-400/50 dark:bg-red-600/95"
                : "bg-blue-500/95 text-white border-blue-400/50 dark:bg-blue-600/95"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle className="w-5 h-5 shrink-0" />
            ) : toast.type === "error" ? (
              <AlertCircle className="w-5 h-5 shrink-0" />
            ) : (
              <Info className="w-5 h-5 shrink-0" />
            )}
            <span className="font-semibold text-sm">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="ml-auto opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}