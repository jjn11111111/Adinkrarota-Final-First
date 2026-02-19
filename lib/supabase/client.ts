'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let _instance: SupabaseClient | null = null
let _checked = false

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function createClient(): SupabaseClient | null {
  if (_instance) return _instance

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

  if (!url || !key) {
    if (!_checked) {
      _checked = true
      console.warn('[Adinkrarota] Supabase not configured – running in guest mode')
    }
    return null
  }

  _instance = createBrowserClient(url, key)
  return _instance
}
