import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton pattern to prevent multiple GoTrueClient instances
let client: SupabaseClient | null = null
let configuredUrl: string | null = null
let configuredKey: string | null = null

// Called from SupabaseEnvProvider to inject server-provided env vars
export function setSupabaseEnv(url: string, anonKey: string) {
  if (configuredUrl !== url || configuredKey !== anonKey) {
    configuredUrl = url
    configuredKey = anonKey
    client = null // Reset client so it picks up new env
  }
}

export function createClient(): SupabaseClient {
  if (client) {
    return client
  }

  const supabaseUrl = configuredUrl || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = configuredKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build/prerendering, env vars may not be available.
    // Return a dummy client that won't crash but won't do anything.
    // At runtime in the browser, the env vars will be available.
    console.warn('Supabase env vars not available — returning placeholder client')
    return new Proxy({} as SupabaseClient, {
      get(_target, prop) {
        if (prop === 'auth') {
          return {
            getUser: async () => ({ data: { user: null }, error: null }),
            getSession: async () => ({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signInWithPassword: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
            signUp: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
            signOut: async () => ({ error: null }),
            updateUser: async () => ({ data: { user: null }, error: null }),
            resend: async () => ({ error: null }),
          }
        }
        if (prop === 'from') {
          return () => ({
            select: () => ({ eq: () => ({ single: async () => ({ data: null, error: { message: 'Supabase not configured' } }) }), order: () => ({ data: [], error: null }) }),
            insert: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
            update: () => ({ eq: async () => ({ error: { message: 'Supabase not configured' } }) }),
            delete: () => ({ eq: async () => ({ error: { message: 'Supabase not configured' } }) }),
          })
        }
        return undefined
      },
    })
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return client
}

export function isSupabaseConfigured(): boolean {
  return !!(
    (configuredUrl || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    (configuredKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  )
}
