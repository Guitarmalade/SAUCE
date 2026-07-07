import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './app/_supabase/middleware'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]
  const pathname = request.nextUrl.pathname

  if (host === 'beta.guitarmalade.com' && pathname === '/') {
    const betaUrl = request.nextUrl.clone()
    betaUrl.pathname = '/beta'
    return NextResponse.rewrite(betaUrl)
  }

  const isPublicRoute =
    pathname === '/' ||
    pathname.startsWith('/beta') ||
    pathname.startsWith('/watch') ||
    pathname.startsWith('/api/waitlist') ||
    pathname.startsWith('/api/sauce-diagnostic')

  if (isPublicRoute) {
    return NextResponse.next()
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  try {
    return await updateSession(request)
  } catch (error) {
    console.error('Middleware session update failed:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
