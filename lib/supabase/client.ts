/* v2 - graceful null return, no throw */
import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton pattern to prevent multiple GoTrueClient instances
let client: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(url && key)
}

export function createClient(): SupabaseClient | null {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Gracefully return null - auth features unavailable until env vars are set
    console.warn('[v0] Supabase env vars missing - auth features disabled')
    return null
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return client
}
