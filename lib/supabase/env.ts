export type PublicSupabaseConfig = { url: string; anonKey: string }

/**
 * Values exposed to the browser (inlined at build time for NEXT_PUBLIC_*).
 */
export function getPublicSupabaseConfig(): PublicSupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anonKey) return null
  if (!(url.startsWith("http://") || url.startsWith("https://"))) return null
  return { url, anonKey }
}

/**
 * Server / Edge / Route handlers: also accept non-public names (common on Vercel
 * when only "Supabase integration" vars were added without NEXT_PUBLIC_ prefix).
 */
export function getServerSupabaseConfig(): PublicSupabaseConfig | null {
  const url = (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL
  )?.trim()
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY
  )?.trim()
  if (!url || !anonKey) return null
  if (!(url.startsWith("http://") || url.startsWith("https://"))) return null
  return { url, anonKey }
}

export function isSupabaseConfigured(): boolean {
  return getPublicSupabaseConfig() !== null
}
