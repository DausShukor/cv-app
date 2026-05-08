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

  // Verify the token with Payload's /me endpoint
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${base}/api/frontend-users/me`, {
      headers: { Authorization: `JWT ${token}` },
    })

    if (!res.ok) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/login'
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('payload-token')
      return response
    }
  } catch {
    // If the auth check fails (e.g. cold start), allow through —
    // the page-level server component will redirect if data is missing
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/cv', '/cv/:path*'],
}
