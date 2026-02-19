// Supabase configuration
// NEXT_PUBLIC_SUPABASE_URL is derived from POSTGRES_HOST in next.config.mjs
// so it's available to both server and client code.

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
