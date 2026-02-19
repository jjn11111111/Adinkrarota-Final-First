'use client'

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { supabaseUrl, supabaseAnonKey } from './config'

let client: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  if (client) return client
  client = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  return client
}
