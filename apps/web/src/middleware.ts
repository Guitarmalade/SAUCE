import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './app/_supabase/middleware'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.split(':')[0]

  if (host === 'beta.guitarmalade.com' && request.nextUrl.pathname === '/') {
    const betaUrl = request.nextUrl.clone()
    betaUrl.pathname = '/beta'
    return NextResponse.rewrite(betaUrl)
  }

  return await updateSession(request)
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
