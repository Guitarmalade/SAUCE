import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with cross-request state pollution.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')
  const isPublicRoute =
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname.startsWith('/beta') ||
    request.nextUrl.pathname.startsWith('/watch') ||
    request.nextUrl.pathname.startsWith('/api/waitlist')
  
  if (
    !user &&
    !isAuthRoute &&
    !isPublicRoute
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in, fetch their role to redirect properly if they are on root or auth pages
  if (user && (isAuthRoute || request.nextUrl.pathname === '/')) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'STUDENT'
    
    if (role === 'TEACHER' && !request.nextUrl.pathname.startsWith('/teacher')) {
      const url = request.nextUrl.clone()
      url.pathname = '/teacher/dashboard'
      return NextResponse.redirect(url)
    } else if (role === 'STUDENT' && !request.nextUrl.pathname.startsWith('/student')) {
      const url = request.nextUrl.clone()
      url.pathname = '/student/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Enforce role-based routing
  if (user && request.nextUrl.pathname.startsWith('/teacher')) {
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role !== 'TEACHER') {
      const url = request.nextUrl.clone()
      url.pathname = '/student/dashboard'
      return NextResponse.redirect(url)
    }
  }

  if (user && request.nextUrl.pathname.startsWith('/student')) {
    const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (profile?.role !== 'STUDENT') {
      const url = request.nextUrl.clone()
      url.pathname = '/teacher/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
