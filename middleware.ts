import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

// Force Node.js runtime (not Edge) for crypto support
export const runtime = "nodejs"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Protected routes that require authentication
  // Onboarding is NOT protected — pricing (step 1) must be visible without auth.
  // Auth is handled within the onboarding page at step 2.
  const protectedRoutes = ['/dashboard', '/settings']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Auth routes (signin, signup) - redirect to dashboard if already logged in
  const authRoutes = ['/signin', '/signup']
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes to signin
  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL('/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    '/((?!api/auth|api/webhooks|api/subscriptions|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
