'use client'

import CampaignDetailCard from '@/dashboard/components/CampaignDetailCard'
import PoolInfoCard from '@/dashboard/components/PoolInfoCard'
import { ChevronLeft } from '@/components/icons/Chevron_Left'
import { Divider } from '@mui/material'
import LeaderBoards from '@/dashboard/detailComponents/leaderBoard'
import { useParams, useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { GlobalContext } from '@/context/GlobalContext'

const Detail = () => {
  const router = useRouter()
  const params = useParams()
  const address = params.address as string
  const { campaigns } = useContext(GlobalContext)
  const taretCampaign = campaigns.find(
    (campaign: { address: string }) => campaign.address === address,
  )
  const [status, setStatus] = useState<string>('init')

  return (
    <div className="w-full h-full flex flex-col grow">
      <div className="px-10 py-4 text-[">
        <ChevronLeft className="text-2xl cursor-pointer" onClick={() => router.push('/')} />
      </div>
      <div className="flex gap-6 px-10 justify-between">
        <CampaignDetailCard {...taretCampaign} />
        <div className="flex-shrink-0">
          <PoolInfoCard address={address} status={status} setStatus={setStatus} />
        </div>
      </div>
      <div className="mt-12">
        <Divider className="bg-black" />
      </div>
      {/* Leaderboard Section */}
      <div className="flex grow">
        <LeaderBoards setStatus={setStatus} address={address} />
      </div>
    </div>
  )
}

export default Detail
