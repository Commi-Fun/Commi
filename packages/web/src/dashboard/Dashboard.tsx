import * as React from 'react'
import type {} from '@mui/x-date-pickers/themeAugmentation'
import type {} from '@mui/x-charts/themeAugmentation'
import type {} from '@mui/x-tree-view/themeAugmentation'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import AppNavbar from './components/AppNavbar'
import SideMenu from './components/SideMenu'
import AppTheme from '../shared-theme/AppTheme'
import { customColors } from '@/shared-theme/themePrimitives'
import MainGrid from './components/MainGrid'

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props}>
      <CssBaseline />
      <Box sx={{ display: 'flex', backgroundColor: customColors.main.Green01, height: '100vh' }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={() => ({
            flexGrow: 1,
            overflow: 'auto',
          })}>
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              pb: 5,
              px: 3.75,
            }}>
            {/*<Header/>*/}
            {/*<Divider sx={{width: '100%'}}/>*/}
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  )
}
