'use client'
import * as React from 'react'
import { HotCampaignCard } from './HotCampaignCard'
import Image from 'next/image'
import { GlobalContext } from '@/context/GlobalContext'

const HotContainer = () => {
  const { campaigns } = React.useContext(GlobalContext)

  return (
    <div className="flex flex-col relative">
      <div className="flex gap-12 justify-center py-10 px-6 relative">
        {campaigns
          .slice(campaigns.length - 3, campaigns.length)
          .map((item: Record<string, string>, index: number) => (
            <HotCampaignCard
              imgSrc={item.imgUrl}
              tokenName={item.name}
              tokenAddress={item.address}
              key={index}
            />
          ))}
      </div>

      <div className="absolute left-6 right-6 bottom-6 -z-10">
        <Image
          style={{
            width: '100%',
            height: 'auto',
          }}
          src="/images/hotCampaignBackground.png"
          width={1572}
          height={240}
          alt=""
        />
      </div>
    </div>
  )
}

export default HotContainer
