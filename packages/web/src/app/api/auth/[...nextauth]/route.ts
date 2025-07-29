import NextAuth, { type NextAuthOptions } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import { prisma } from '@commi-dashboard/db'
import { nanoid } from 'nanoid'
import { WhitelistStatus } from '@/lib/services/whitelistService'

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      id: 'x',
      clientId: process.env.X_CLIENT_ID as string,
      clientSecret: process.env.X_CLIENT_SECRET as string,
      version: '2.0',
      profile(profile) {
        const userProfile = profile.data
        const standardizedUser = {
          id: userProfile.id,
          twitterId: userProfile.id,
          name: userProfile.name,
          image: userProfile.profile_image_url,
          username: userProfile.username,
          email: userProfile.email,
        }

        return standardizedUser
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        const twitterId = user.id

        // 将用户信息存入数据库
        const dbUser = await prisma.user.upsert({
          where: {
            twitterId: twitterId,
          },
          update: {
            profileImageUrl: user.image || undefined,
            name: user.name || 'Unknown',
            handle: user.username || 'unknown',
          },
          create: {
            twitterId: twitterId,
            profileImageUrl: user.image || undefined,
            name: user.name || 'Unknown',
            handle: user.username || 'unknown',
          },
        })

        // 创建 whitelist
        const whitelist = await prisma.whitelist.upsert({
          where: {
            twitterId: dbUser.twitterId,
          },
          update: {},
          create: {
            userId: dbUser.id,
            twitterId: dbUser.twitterId,
            referralCode: nanoid(6),
            status: WhitelistStatus.REGISTERED,
          },
        })

        user.referralCode = whitelist.referralCode

        user.userId = dbUser.id.toString()

        return true // 允许登录
      } catch (error) {
        return false // 拒绝登录
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id // Twitter ID
        token.twitterId = user.id // Twitter ID
        token.userId = user.userId
        token.name = user.name
        token.picture = user.image
        token.referralCode = user.referralCode
        if (user.username) {
          token.username = user.username
        }
      }

      return token
    },

    async session({ session, token }) {
      // 设置 session 数据
      session.user.id = token.id
      session.user.twitterId = token.id // 保留 Twitter ID
      session.user.userId = token.userId // 从数据库获取的 ID
      session.user.name = token.name
      session.user.image = token.picture
      session.user.referralCode = token.referralCode

      // Pass the username from the token to the session
      if (token.username) {
        session.user.username = token.username
      }

      return session
    },
  },
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }
