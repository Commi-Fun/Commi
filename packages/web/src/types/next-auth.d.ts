import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      twitterId: string
      username?: string
      userId?: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    userId?: string
    username?: string
    twitterId: string // 添加你的自定义字段
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId?: string
    id: string
    username?: string
  }
}
