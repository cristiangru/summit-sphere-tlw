// src/lib/supabase/server.ts
//
// Client Supabase pentru server-side (server actions, route handlers).
// Folosește SERVICE_ROLE key → bypass complet RLS → doar pe server.
//
// NU importa în componente "use client".
// NU expune SUPABASE_SERVICE_ROLE_KEY în browser (nu are prefix NEXT_PUBLIC_).
//
// De ce nu mai folosim createServerClient cu cookies?
// → Acel pattern e pentru Supabase Auth (sesiuni în cookies).
// → Noi folosim Clerk pentru auth → nu există sesiune Supabase în cookies.
// → Tot ce facem server-side merge cu service_role direct.

import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "[Supabase] Lipsesc variabilele de mediu: NEXT_PUBLIC_SUPABASE_URL sau SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}