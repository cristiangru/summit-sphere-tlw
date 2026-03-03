// src/components/toast/ToastProvider.tsx
"use client";

import { createContext, ReactNode, useContext } from "react";
import { useToast } from "@/lib/hooks/useToast";
import ToastContainer from "./ToastContainer";

interface ToastContextType {
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider
      value={{
        success: toast.success,
        error: toast.error,
        info: toast.info,
        removeToast: toast.removeToast,
      }}
    >
      {children}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </ToastContext.Provider>
  );
};