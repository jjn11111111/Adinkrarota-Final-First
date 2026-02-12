"use client";

import { type ReactNode, useEffect } from "react";
import { setSupabaseEnv } from "@/lib/supabase/client";

export function SupabaseEnvProvider({
  url,
  anonKey,
  children,
}: {
  url: string;
  anonKey: string;
  children: ReactNode;
}) {
  // Inject server-provided env vars into the client singleton on mount
  useEffect(() => {
    if (url && anonKey) {
      setSupabaseEnv(url, anonKey);
    }
  }, [url, anonKey]);

  // Also set synchronously so the first render has access
  if (url && anonKey) {
    setSupabaseEnv(url, anonKey);
  }

  return <>{children}</>;
}
