import AppTheme from '@/shared-theme/AppTheme'
import './invite.css'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-screen min-h-screen">
      <AppTheme>{children}</AppTheme>
    </div>
  )
}

export default Layout
