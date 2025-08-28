'use client'
import * as React from 'react'
import CollapsibleSection from './CollapsibleSection'
import ClaimCampaign from './ClaimCampaign'
import { useCampaignListParticipated } from '@/query/query'
import { useSession } from 'next-auth/react'
import { Campaign } from '@/types/campaign'

const JoinedCampaignList = () => {
  const { data: session } = useSession()
  const { data: campaigns } = useCampaignListParticipated(session?.user?.userId)
  console.log('🚀 ~ JoinedCampaignList ~ campaigns:', campaigns)

  return (
    <CollapsibleSection title="Campaign Joined" defaultOpen={true}>
      <div className="w-full max-w-sm">
        {campaigns?.map((campaign: Campaign) => {
          const remainingAmount =
            campaign.totalAmount - (campaign.totalAmount - campaign.remainingAmount)
          const claimableAmount = campaign.claimed ? '0' : remainingAmount.toString()
          const tokenPrice = campaign.marketCap
            ? `$${(Number(campaign.marketCap) / campaign.totalAmount).toFixed(6)}`
            : '$0.000000'

          return (
            <ClaimCampaign
              key={campaign.id}
              tokenName={campaign.tokenName}
              tokenPrice={tokenPrice}
              statusLabel="Claimable"
              statusValue={`${claimableAmount} (${campaign.ticker || 'TOKEN'})`}
              buttonText={campaign.claimed ? 'Claimed' : 'Claim'}
              variant={campaign.claimed ? 'outline' : 'filled'}
              disabled={campaign.claimed || Number(claimableAmount) === 0}
              onClick={() => console.log('Claim clicked for campaign:', campaign.id)}
            />
          )
        }) || []}
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
