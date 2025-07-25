import AppTheme from '@/shared-theme/AppTheme'
import '../globals.css'
import './invite.css'
import { NextAuthProvider } from '@/components/NextAuthProvider'
import { Nunito } from 'next/font/google'

// app/page.tsx 或 app/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commi',
  description: '',
  openGraph: {
    title: 'Commi',
    description: '',
    url: 'https://commi.fun',
    siteName: 'Commi',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg', // 1200x630px 推荐
        width: 1200,
        height: 630,
        alt: '项目预览图',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commi - 你的项目标题',
    description: '项目描述',
    images: ['https://yourdomain.com/twitter-image.jpg'], // 1200x600px 推荐
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
