// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ACTIVE_HOME_PAGE = process.env.ACTIVE_HOME_PAGE

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/') {
    if (ACTIVE_HOME_PAGE === 'invite') {
      return NextResponse.redirect(new URL('/invite', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
