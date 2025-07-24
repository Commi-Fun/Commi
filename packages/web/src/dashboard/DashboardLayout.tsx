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
      <Box
        sx={{
          display: 'flex',
          backgroundColor: customColors.main.Black,
          height: '100vh',
        }}>
        <SideMenu />
        <AppNavbar />
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
          }}>
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              pb: 5,
            }}>
            <Header />
            <Divider sx={{ width: '100%' }} style={{ marginTop: '10px' }} />
            {children}
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  )
}
