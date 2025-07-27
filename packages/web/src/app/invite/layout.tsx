import AppTheme from '@/shared-theme/AppTheme'
import '../globals.css'
import './invite.css'
import { NextAuthProvider } from '@/components/NextAuthProvider'
import { Nunito } from 'next/font/google'

// app/page.tsx 或 app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commi - Join the Airdrop Early!',
  description:
    "🧃Airdrop season's coming. Join Commi early and get whitelisted now or regret later!",
  icons: {
    icon: '/logo.ico',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commi - Join the Airdrop Early!',
    description:
      "🧃Airdrop season's coming. Join Commi early and get whitelisted now or regret later!",
    images: ['/images/commiCup.png'], // 需要在 public 文件夹中添加这个图片
    creator: '@commidotfun',
    site: '@commidotfun',
  },
}

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito', // CSS 变量名
})

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={nunito.variable}>
      <body className={`${nunito.className} relative overflow-hidden min-h-screen w-screen`}>
        <NextAuthProvider>
          <AppTheme>{children}</AppTheme>
        </NextAuthProvider>
      </body>
    </html>
  )
}

export default Layout
