import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /cv routes
  if (!pathname.startsWith('/cv')) {
    return NextResponse.next()
  }

  const token = req.cookies.get('payload-token')?.value

  if (!token) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Token exists — allow through.
  // Avoid HTTP self-calls here: on Vercel serverless they cause cold-start
  // timeouts that loop back to /login. The CV page server component handles
  // any invalid/expired token at the data-fetch level.
  return NextResponse.next()
}

export const config = {
  matcher: ['/cv', '/cv/:path*'],
}
