import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import TwitterProvider from 'next-auth/providers/twitter'
import { prisma } from 'packages/db/src/index'
import { SiweMessage } from 'siwe'

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      id: 'x',
      clientId: process.env.X_CLIENT_ID as string,
      clientSecret: process.env.X_CLIENT_SECRET as string,
      version: '2.0',
      // ✨ 使用 profile 回调来标准化数据
      profile(profile) {
        // profile.data 包含了从 X API v2 返回的用户信息
        const userProfile = profile.data
        // 我们在这里创建一个标准化的 user 对象
        return {
          id: userProfile.id, // 这是数字 ID
          name: userProfile.name, // 这是你的显示名称
          image: userProfile.profile_image_url, // 这是你的头像
          username: userProfile.username, // 这是你的 @ 用户名
        }
      },
    }),
    CredentialsProvider({
      // ... 你的 CredentialsProvider 配置保持不变
      name: 'Ethereum',
      credentials: {
        message: { label: 'Message', type: 'text', placeholder: '0x0' },
        signature: { label: 'Signature', type: 'text', placeholder: '0x0' },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || '{}'))
          const result = await siwe.verify({
            signature: credentials?.signature || '',
          })
          if (result.success) {
            return { id: siwe.address }
          }
          return null
        } catch (e) {
          console.error(e)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      // The user object is available on the first sign-in.
      if (user) {
        token.id = user.id
        token.name = user.name
        token.picture = user.image
        // Add the username from the user object (returned by the profile callback)
        if (user.username) {
          token.username = user.username
        }

        // update user info
        await prisma.user.upsert({ 
          where: {
            twitterId: user.id,
          },
          update: {
            profileImageUrl: user.image,
            name: user.name,
            username: user.username,
          },
          create: {
            twitterId: user.id,
            profileImageUrl: user.image,
            name: user.name,
            username: user.username,
          }
         });
      }
      return token
    },

    async session({ session, token }) {
      // The types for `session` and `token` are now inferred from the .d.ts file.
      session.user.id = token.id
      session.user.name = token.name
      session.user.image = token.picture

      // Pass the username from the token to the session
      if (token.username) {
        session.user.username = token.username
      }

      // For Ethereum login, `sub` holds the address
      if (!token.username) { // An easy way to distinguish from X login
        session.address = token.sub
      }

      return session
    },
  },
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }
