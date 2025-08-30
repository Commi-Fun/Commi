import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      twitterId: string
      handle: string
      userId: number
      referralCode?: string
      status?: string
      isNew?: boolean
      registered?: boolean
      followed?: boolean
      posted?: boolean
      referred?: boolean
      claimed?: boolean
      wallets?: string[]
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    userId: number
    handle: string
    twitterId: string
    referralCode?: string
    status?: string
    isNew?: boolean
    registered?: boolean
    followed?: boolean
    posted?: boolean
    referred?: boolean
    claimed?: boolean
    wallets?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId: number
    id: string
    handle: string
    referralCode?: string
    status?: string
    isNew?: boolean
    registered?: boolean
    followed?: boolean
    posted?: boolean
    referred?: boolean
    claimed?: boolean
    wallets?: string[]
  }
}
