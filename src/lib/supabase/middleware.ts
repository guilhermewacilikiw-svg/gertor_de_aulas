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
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Routing logic based on auth and role
  const isPublicRoute = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/login')
  
  if (!user && !isPublicRoute) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  
  if (user && isPublicRoute) {
      // Fetch user role if logged in
      const { data: roleData } = await supabase
        .from('school_memberships')
        .select('role, school_id')
        .eq('user_id', user.id) // This assumes user_id and auth_user_id mapping exists or we use auth_user_id directly in policies
        .limit(1)
        .single()
        
      // For now, redirect to /escola/dashboard if they log in. 
      // Later we will route based on 'roleData.role'
      const url = request.nextUrl.clone()
      url.pathname = '/escola/dashboard'
      return NextResponse.redirect(url)
  }

  return supabaseResponse
}
