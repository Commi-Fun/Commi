import { NextResponse } from 'next/server'
import { withAuth } from 'next-auth/middleware'

export const authMiddleware = withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (!token) {
          return false
        }

        return true
      },
    },
    pages: {
      signIn: '/invite', // 没有session时跳转到 /invite
    },
  },
)
