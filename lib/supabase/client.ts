import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  getPublicSupabaseConfig,
  isSupabaseConfigured as hasEnv,
} from '@/lib/supabase/env'

let client: SupabaseClient | null = null

export function createClient(): SupabaseClient | null {
  if (client) {
    return client
  }

  const cfg = getPublicSupabaseConfig()
  if (!cfg) {
    return null
  }

  try {
    const isHttps =
      typeof window !== "undefined" && window.location.protocol === "https:";

    client = createBrowserClient(cfg.url, cfg.anonKey, {
      cookieOptions: {
        path: "/",
        sameSite: "lax",
        ...(isHttps ? { secure: true } : {}),
      },
      auth: {
        // Only /auth/callback exchanges the PKCE code; avoids races with AuthProvider getUser()
        // and stops /?code= on the home page from running auto URL handling.
        detectSessionInUrl: false,
      },
    });
    return client;
  } catch {
    return null
  }
}

export function isSupabaseConfigured(): boolean {
  return hasEnv()
}
