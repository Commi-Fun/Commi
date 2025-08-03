'use client'
import * as React from 'react'
import Box from '@mui/material/Box'
import HotContainer from '@/dashboard/components/HotContainer'
import CampaignsContainer from '@/dashboard/CampaignsContainer'

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', px: '1.875rem' }}>
      <HotContainer />
      <CampaignsContainer />
    </Box>
  )
}
