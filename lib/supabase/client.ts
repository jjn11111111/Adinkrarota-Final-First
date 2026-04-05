import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getPublicSupabaseConfig, isSupabaseConfigured as hasPublicEnv } from '@/lib/supabase/env'

let client: SupabaseClient | null = null
let initInFlight: Promise<SupabaseClient | null> | null = null

function createAndRememberBrowserClient(cfg: {
  url: string
  anonKey: string
}): SupabaseClient | null {
  try {
    client = createBrowserClient(cfg.url, cfg.anonKey)
    return client
  } catch {
    return null
  }
}

/**
 * Sync path when NEXT_PUBLIC_* was available at build time.
 */
export function createClient(): SupabaseClient | null {
  if (client) {
    return client
  }

  const cfg = getPublicSupabaseConfig()
  if (!cfg) {
    return null
  }

  return createAndRememberBrowserClient(cfg)
}

/**
 * Browser: uses inlined NEXT_PUBLIC_* or fetches /api/auth/supabase-config
 * (covers SUPABASE_URL + SUPABASE_ANON_KEY on the server only).
 */
export function initSupabaseBrowserClient(): Promise<SupabaseClient | null> {
  if (typeof window === 'undefined') {
    return Promise.resolve(null)
  }

  if (client) {
    return Promise.resolve(client)
  }

  const inline = getPublicSupabaseConfig()
  if (inline) {
    return Promise.resolve(createAndRememberBrowserClient(inline))
  }

  if (initInFlight) {
    return initInFlight
  }

  initInFlight = fetch('/api/auth/supabase-config', { cache: 'no-store' })
    .then(async (res) => {
      if (!res.ok) {
        return null
      }
      const data = (await res.json()) as { url?: string; anonKey?: string }
      if (!data?.url || !data?.anonKey) {
        return null
      }
      return createAndRememberBrowserClient({
        url: data.url,
        anonKey: data.anonKey,
      })
    })
    .catch(() => null)
    .finally(() => {
      initInFlight = null
    })

  return initInFlight
}

export function isSupabaseConfigured(): boolean {
  return hasPublicEnv()
}
