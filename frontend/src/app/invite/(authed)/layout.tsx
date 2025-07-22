'use client'
import AppTheme from '@/shared-theme/AppTheme'
import '../../globals.css'
import '../invite.css'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html>
      <body className={'font-nunito !bg-green01-500'}>
        <AppTheme>{children}</AppTheme>
      </body>
    </html>
  )
}

export default Layout
