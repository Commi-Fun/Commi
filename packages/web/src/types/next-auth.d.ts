import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      twitterId: string
      username?: string
      userId: number
      referralCode?: string
      status?: string
      isNew?: boolean
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    userId: number
    username?: string
    twitterId: string // 添加你的自定义字段
    referralCode?: string
    status?: string
    isNew?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId: number
    id: string
    username?: string
    referralCode?: string
    status?: string
    isNew?: boolean
  }
}
