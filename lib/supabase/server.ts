import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { supabaseUrl, supabaseAnonKey } from './config'

export async function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
