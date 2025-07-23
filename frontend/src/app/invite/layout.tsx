import AppTheme from '@/shared-theme/AppTheme'
import '../globals.css'
import './invite.css'
import { NextAuthProvider } from '@/components/NextAuthProvider'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={'font-nunito !bg-green01-500 relative overflow-hidden'}>
        <NextAuthProvider>
          <AppTheme>{children}</AppTheme>
        </NextAuthProvider>
      </body>
    </html>
  )
}

export default Layout
