import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  // Check for Supabase auth token in cookies
  // Supabase stores auth tokens in cookies prefixed with 'sb-'
  const hasAuthToken = request.cookies.getAll().some(
    (cookie) => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token')
  )

  // Protect /portal and /membership routes - redirect to login if no auth token
  if (
    (request.nextUrl.pathname.startsWith('/portal') ||
      request.nextUrl.pathname.startsWith('/membership')) &&
    !hasAuthToken
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
