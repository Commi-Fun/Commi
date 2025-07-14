import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import TwitterProvider from 'next-auth/providers/twitter'
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
        const userProfile = profile.data;
        // 我们在这里创建一个标准化的 user 对象
        return {
          id: userProfile.id, // 这是数字 ID
          name: userProfile.name, // 这是你的显示名称
          image: userProfile.profile_image_url, // 这是你的头像
          x_handle: userProfile.username, // 这是你的 @ 用户名
        };
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
    // ✨ 现在 jwt 回调变得更简单
    async jwt({ token, user }) {
      // 首次登录时，user 对象是由上面 profile 回调创建的
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.picture = user.image;
        // 我们需要把自定义的 x_handle 添加到 token 中
        if ('x_handle' in user) {
            token.x_handle = user.x_handle;
        }
      }
      return token;
    },

    // ✨ session 回调也相应更新
    async session({ session, token }: { session: any; token: any }) {
      // 同时处理来自 X 和 Ethereum 的登录
      session.user.id = token.id || token.sub;
      session.user.name = token.name;
      session.user.image = token.picture;
      
      if (token.x_handle) {
        session.user.handle = token.x_handle;
      } else {
        // 如果是 Ethereum 登录, sub 存的是地址
        session.address = token.sub;
      }

      return session;
    },
  },
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }
