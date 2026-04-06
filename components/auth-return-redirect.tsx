"use client";

import { useEffect } from "react";
import { urlLooksLikeSupabaseAuthReturn } from "@/lib/auth/url-looks-like-supabase-return";

/**
 * Supabase email links sometimes open the Site URL with ?code= or #access_token=.
 * The browser client uses detectSessionInUrl: false, so we forward once to /auth/callback.
 */
export function AuthReturnRedirect() {
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    if (pathname.startsWith("/auth/callback")) return;
    if (!urlLooksLikeSupabaseAuthReturn(search, hash)) return;
    window.location.replace(`/auth/callback${search}${hash}`);
  }, []);
  return null;
}
