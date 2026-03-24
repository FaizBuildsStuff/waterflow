import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  const payload = token ? await verifyToken(token) : null

  // Protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/onboarding')) {
    if (!payload) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    // Onboarding redirect logic
    if (pathname.startsWith('/dashboard') && !payload.onboarded) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    
    if (pathname.startsWith('/onboarding') && payload.onboarded) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Auth routes (redirect to correct destination if already logged in)
  if (pathname === '/signin' || pathname === '/signup') {
    if (payload) {
      const destination = payload.onboarded ? '/dashboard' : '/onboarding'
      return NextResponse.redirect(new URL(destination, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding', '/signin', '/signup'],
}
