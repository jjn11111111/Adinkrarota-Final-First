import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request })

  // Check for Supabase auth token in cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (() => {
    const host = process.env.POSTGRES_HOST
    if (host) {
      const match = host.match(/^db\.(.+\.supabase\.co)$/)
      if (match) return `https://${match[1]}`
    }
    return ''
  })()

  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

  if (!supabaseUrl || !supabaseAnonKey) {
    // If we can't connect to Supabase, just pass through
    return supabaseResponse
  }

  const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        // Forward cookies for auth
        cookie: request.headers.get('cookie') || '',
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /portal and /membership routes
  if (
    (request.nextUrl.pathname.startsWith('/portal') ||
      request.nextUrl.pathname.startsWith('/membership')) &&
    !user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
