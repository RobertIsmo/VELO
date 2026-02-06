'use strict'

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup')

  // If user is logged in and tries to access auth pages, redirect to home
  if (userId && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/signup', '/api/:path*'],
}
