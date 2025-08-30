import NextAuth, { type NextAuthOptions } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import { prisma } from '@commi-dashboard/db'
import { nanoid } from 'nanoid'
import { WhitelistStatus } from '@/lib/services/whitelistService'
console.log('process.env.TWITTER_API_KEY', process.env.TWITTER_API_KEY)
console.log('process.env.TWITTER_API_SECRET', process.env.TWITTER_API_SECRET)
export const nextAuthOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      id: 'x',
      clientId: process.env.TWITTER_API_KEY as string,
      clientSecret: process.env.TWITTER_API_SECRET as string,
      version: '1.0a',
      authorization: {
        url: 'https://api.twitter.com/oauth/authorize',
        // params: {
        //   force_login: true,
        // },
      },
      profile(profile) {
        console.log('sign in profile', profile)
        const standardizedUser = {
          id: profile.id_str,
          twitterId: profile.id_str,
          name: profile.name,
          image: profile.profile_image_url,
          handle: profile.screen_name,
          userId: -1,
        }

        return standardizedUser
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    error: '/invite',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      try {
        console.log('sign in twitterId', user.twitterId)

        const twitterId = user.twitterId

        // 将用户信息存入数据库
        const dbUser = await prisma.user.upsert({
          where: {
            twitterId: twitterId,
          },
          update: {
            profileImageUrl: user.image || undefined,
            name: user.name || 'Unknown',
            handle: user.handle || 'unknown',
          },
          create: {
            twitterId: twitterId,
            profileImageUrl: user.image || undefined,
            name: user.name || 'Unknown',
            handle: user.handle || 'unknown',
          },
        })
        console.log('sign in dbUser', dbUser)

        // 创建 whitelist
        let whitelist = await prisma.whitelist.findFirst({
          where: {
            userId: dbUser.id,
          },
        })
        if (whitelist === null) {
          whitelist = await prisma.whitelist.create({
            data: {
              userId: dbUser.id,
              twitterId: dbUser.twitterId,
              referralCode: nanoid(6),
              status: WhitelistStatus.REGISTERED,
              registeredAt: new Date(),
            },
          })
          user.isNew = true
        } else {
          user.isNew = false
        }
        console.log('sign in whitelist', whitelist)

        user.referralCode = whitelist.referralCode
        user.status = whitelist.status
        user.registered = whitelist.registeredAt !== null
        user.followed = whitelist.followedAt !== null
        user.posted = whitelist.postedAt !== null
        user.referred = whitelist.referredAt !== null
        user.claimed = whitelist.claimedAt !== null
        user.userId = dbUser.id

        return true // 允许登录
      } catch (error) {
        return '/invite'
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id // Twitter ID
        token.twitterId = user.twitterId // Twitter ID
        token.userId = user.userId
        token.name = user.name
        token.picture = user.image
        token.referralCode = user.referralCode
        token.status = user.status
        token.isNew = user.isNew
        token.registered = user.registered
        token.followed = user.followed
        token.posted = user.posted
        token.referred = user.referred
        token.claimed = user.claimed
        token.wallets = user.wallets
        token.handle = user.handle
      }

      console.log('sign in jwt token', token)

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
      session.user.status = token.status
      session.user.isNew = token.isNew
      session.user.registered = token.registered
      session.user.followed = token.followed
      session.user.posted = token.posted
      session.user.referred = token.referred
      session.user.claimed = token.claimed
      session.user.wallets = token.wallets
      session.user.handle = token.handle

      console.log('sign in session', session)

      return session
    },

    async redirect({ url, baseUrl, error }) {
      console.log('nextAuthOptions redirect', url, baseUrl)
      // // 检查是否是因用户取消授权导致的错误
      // if (url.includes('error=Callback') || url.includes('error=OAuthCallback')) {
      //   return '/' // 跳转到首页
      // }
      // return url.startsWith('/') ? new URL(url, baseUrl).href : url
      return '/'
    },
  },
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }
