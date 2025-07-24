import AppTheme from '@/shared-theme/AppTheme'
import '../globals.css'
import './invite.css'
import { NextAuthProvider } from '@/components/NextAuthProvider'
import { Nunito } from 'next/font/google'

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
