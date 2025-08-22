'use client'
import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import AppNavbar from '@/dashboard/components/AppNavbar'
import Header from '@/dashboard/components/Header'
import SideMenu from '@/dashboard/components/SideMenu'
import AppTheme from '@/shared-theme/AppTheme'
import Divider from '@mui/material/Divider'
import { customColors } from '@/shared-theme/themePrimitives'
import MainGrid from './components/MainGrid'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <AppTheme>
      <CssBaseline />
      <div className="min-h-svh flex flex-col">
        <div>
          <Header />
        </div>
        <div className="flex grow flex-col">{children}</div>
      </div>
    </AppTheme>
  )
}
