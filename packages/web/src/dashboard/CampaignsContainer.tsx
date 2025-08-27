'use client'
import CampaignCard from '@/dashboard/components/CampaignCard'
import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { useCampaigns } from '@/query/query'
import { Campaign } from '@/types/campaign'

const CampaignsContainer = () => {
  const [value, setValue] = React.useState('one')
  const { data: compaginList } = useCampaigns()

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <div className="flex px-7 bg-blue-100 grow flex-col pb-6 w-full">
      <div className="flex items-center gap-3 py-6 justify-between">
        <Tabs value={value} onChange={handleChange} aria-label="campaign categories">
          <Tab value="one" label="All" />
          <Tab value="two" label="Bonk" />
          <Tab value="three" label="Campaign" />
        </Tabs>
      </div>
      <div className="flex gap-4 overflow-auto">
        {compaginList?.map((item: Campaign, index: number) => (
          <CampaignCard
            key={index}
            tokenName={item.tokenName}
            marketCap={item.marketCap}
            address={item.tokenAddress}
            members={[]}
            totalAmount={item.totalAmount}
            currentAmount={item.totalAmount - item.remainingAmount}
          />
        ))}
      </div>
    </div>
  )
}

export default CampaignsContainer
