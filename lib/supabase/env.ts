export type PublicSupabaseConfig = { url: string; anonKey: string }

/** NEXT_PUBLIC_* — must be set for Production on Vercel and included in the build. */
export function getPublicSupabaseConfig(): PublicSupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anonKey) return null
  if (!(url.startsWith("http://") || url.startsWith("https://"))) return null
  return { url, anonKey }
}

export function isSupabaseConfigured(): boolean {
  return getPublicSupabaseConfig() !== null
}
