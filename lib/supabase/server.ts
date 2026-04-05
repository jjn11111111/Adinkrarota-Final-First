import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getServerAuthCookieOptions } from '@/lib/supabase/auth-cookie-options'
import { getPublicSupabaseConfig } from '@/lib/supabase/env'

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cfg = getPublicSupabaseConfig()
  if (!cfg) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient(
    cfg.url,
    cfg.anonKey,
    {
      cookieOptions: getServerAuthCookieOptions(),
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // The "setAll" method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
