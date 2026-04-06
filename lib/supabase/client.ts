import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getBrowserAuthCookieOptions } from '@/lib/supabase/auth-cookie-options'
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
    client = createBrowserClient(cfg.url, cfg.anonKey, {
      cookieOptions: getBrowserAuthCookieOptions(),
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

/**
 * Fresh client for /auth/callback only: does not auto-run initialize() (which can
 * block on _recoverAndRefresh while ?code= is present but the PKCE verifier cookie
 * is missing — e.g. reset link opened in another browser). Uses the same cookie
 * storage as the singleton so the verifier from the tab that requested reset is
 * visible. Not a singleton to avoid sharing initializePromise with AuthProvider.
 */
export function createAuthCallbackClient(): SupabaseClient | null {
  const cfg = getPublicSupabaseConfig()
  if (!cfg) {
    return null
  }

  try {
    return createBrowserClient(cfg.url, cfg.anonKey, {
      isSingleton: false,
      cookieOptions: getBrowserAuthCookieOptions(),
      auth: {
        detectSessionInUrl: false,
        // Supported by GoTrue; @supabase/ssr typings omit it.
        ...({ skipAutoInitialize: true } as { skipAutoInitialize?: boolean }),
      },
    })
  } catch {
    return null
  }
}
