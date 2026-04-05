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
    client = createBrowserClient(cfg.url, cfg.anonKey)
    return client
  } catch {
    return null
  }
}

export function isSupabaseConfigured(): boolean {
  return hasEnv()
}
