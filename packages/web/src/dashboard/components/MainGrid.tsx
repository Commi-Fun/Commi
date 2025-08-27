'use client'
import * as React from 'react'
import HotContainer from '@/dashboard/components/HotContainer'
import CampaignsContainer from '@/dashboard/CampaignsContainer'

export default function MainGrid() {
  return (
    <div className="h-full flex flex-col">
      <HotContainer />
      <CampaignsContainer />
    </div>
  )
}
