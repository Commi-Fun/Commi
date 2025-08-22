'use client'
import * as React from 'react'
import CollapsibleSection from './CollapsibleSection'
import ClaimCampaign from './ClaimCampaign'
import { dummyCampaigns } from '@/lib/constants'

const JoinedCampaignList = () => {
  return (
    <CollapsibleSection title="Campaign Joined" defaultOpen={true}>
      <div className="w-full max-w-sm">
        {dummyCampaigns.map((item: Record<string, string>, index: number) => (
          <ClaimCampaign
            key={index}
            tokenName={item.name}
            tokenPrice={item.price}
            statusLabel="Claimable"
            statusValue="123.45 (tick)"
            buttonText="Claim"
            variant="filled"
            tokenImage={item.imgUrl}
            onClick={() => console.log('Claim clicked')}
          />
        ))}
        {/* 
        <ClaimCampaign
          tokenName="Token name"
          tokenPrice="$0.00123"
          statusLabel="Claimable"
          statusValue="123.45 (tick)"
          buttonText="Claim"
          variant="filled"
          onClick={() => console.log('Claim clicked')}
        />

        <ClaimCampaign
          tokenName="Token name"
          tokenPrice="$0.00123"
          statusLabel="Claimable"
          statusValue="0"
          buttonText="Claim"
          variant="outline"
          disabled={true}
          onClick={() => console.log('Disabled claim clicked')}
        /> */}
      </div>
    </CollapsibleSection>
  )
}

export default JoinedCampaignList
