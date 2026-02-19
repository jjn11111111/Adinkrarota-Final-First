// Derives the Supabase project URL from available environment variables.
// The Supabase integration provides POSTGRES_HOST (db.XXXX.supabase.co)
// but not NEXT_PUBLIC_SUPABASE_URL. We extract the project ref and construct it.

function getSupabaseUrl(): string {
  // First check if the URL is directly available
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
  }

  // Derive from POSTGRES_HOST: "db.XXXX.supabase.co" -> "https://XXXX.supabase.co"
  const host = process.env.POSTGRES_HOST
  if (host) {
    const match = host.match(/^db\.(.+\.supabase\.co)$/)
    if (match) {
      return `https://${match[1]}`
    }
    // Fallback: try aws-0- prefix pattern "aws-0-REGION.pooler.supabase.com"
    // In this case we can't derive the URL, so fall through
  }

  throw new Error(
    'Cannot determine Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL or ensure POSTGRES_HOST is available.'
  )
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY
  if (!key) {
    throw new Error(
      'Cannot determine Supabase anon key. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY.'
    )
  }
  return key
}

export const supabaseUrl = getSupabaseUrl()
export const supabaseAnonKey = getSupabaseAnonKey()
