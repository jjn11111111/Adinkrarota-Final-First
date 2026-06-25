import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

function isValidSupabaseUrl(url: string | undefined): boolean {
  return !!url && (url.startsWith("http://") || url.startsWith("https://"))
}

// Singleton pattern to prevent multiple GoTrueClient instances
let client: SupabaseClient | null = null

export function createClient(): SupabaseClient | null {
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!isValidSupabaseUrl(supabaseUrl) || !supabaseAnonKey) {
    return null
  }

  try {
    client = createBrowserClient(supabaseUrl, supabaseAnonKey)
    return client
  } catch {
    return null
  }
}

export function isSupabaseConfigured(): boolean {
  return isValidSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}
