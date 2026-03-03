// src/app/admin/AdminLayoutClient.tsx
"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "@/components/ToastProvider";
import { ReactNode } from "react";

export default function AdminLayoutClient({ children }: { children: ReactNode }) {
  // ✅ useState în loc de useMemo — garantează că QueryClient nu se recreează niciodată
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,       // 30s default pentru toate query-urile
            gcTime: 5 * 60 * 1000,      // 5 minute în memorie
            retry: 2,
            retryDelay: (i) => Math.min(1000 * 2 ** i, 30000),
            refetchOnWindowFocus: false, // ✅ global — elimină re-fetch-urile la alt-tab
          },
          mutations: {
            retry: 1,
            retryDelay: 1000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}