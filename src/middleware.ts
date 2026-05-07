import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('payload-token')?.value
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  // If a frontend user tries to access /admin, redirect them to /cv
  if (pathname.startsWith('/admin')) {
    if (!token) return NextResponse.next()
    try {
      const res = await fetch(`${base}/api/users/me`, {
        headers: { Authorization: `JWT ${token}` },
      })
      if (!res.ok) {
        return NextResponse.redirect(new URL('/cv', req.url))
      }
    } catch {
      return NextResponse.next()
    }
    return NextResponse.next()
  }

  // Protect /cv routes — must be a valid frontend user
  if (pathname.startsWith('/cv')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    try {
      const res = await fetch(`${base}/api/frontend-users/me`, {
        headers: { Authorization: `JWT ${token}` },
      })
      if (!res.ok) {
        const response = NextResponse.redirect(new URL('/login', req.url))
        response.cookies.delete('payload-token')
        return response
      }
    } catch {
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cv', '/cv/:path*', '/admin', '/admin/:path*'],
}
