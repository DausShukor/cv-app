import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('payload-token')?.value

  // Protect /cv — redirect to login if no token present
  if (pathname.startsWith('/cv')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cv', '/cv/:path*'],
}
