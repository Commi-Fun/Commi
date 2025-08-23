'use client'
import CampaignCard from '@/dashboard/components/CampaignCard'
import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { GlobalContext } from '@/context/GlobalContext'

const CampaignsContainer = () => {
  const [value, setValue] = React.useState('one')
  const { campaigns } = React.useContext(GlobalContext)

  React.useEffect(() => {
    fetch('/api/campaign/list')
  }, [])

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
        {campaigns.map((item: Record<string, string>, index: number) => (
          <CampaignCard
            key={index}
            tokenImage={item.imgUrl}
            tokenName={item.name}
            marketCap={item.MCap}
            address={item.address}
            members={item.members}
            totalAmount={item.poolSize}
            currentAmount={item.takenAmount}
          />
        ))}
      </div>
    </div>
  )
}

export default CampaignsContainer
