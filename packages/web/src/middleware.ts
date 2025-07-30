import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authMiddleware } from './middlewares/auth'

const ACTIVE_HOME_PAGE = process.env.ACTIVE_HOME_PAGE

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. 首页重定向逻辑（保留原有逻辑）
  if (pathname === '/') {
    if (ACTIVE_HOME_PAGE === 'invite') {
      // 🎯 保留查询参数进行重定向
      const redirectUrl = new URL('/invite', request.url)
      // 复制原始 URL 的查询参数
      redirectUrl.search = request.nextUrl.search
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }

  // 2. API 路由 - 需要认证
  if (pathname.startsWith('/api')) {
    // @ts-expect-error 无法识别 authMiddleware 的类型，忽略报错
    return authMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api/auth/* (NextAuth 路由)
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (网站图标)
     * - 静态资源文件
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
