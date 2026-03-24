import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
  const isAdminApi = req.nextUrl.pathname.startsWith('/api/admin')

  if (isAdminPage || isAdminApi) {
    if (!token || token.role !== 'ADMIN') {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
