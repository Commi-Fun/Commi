import { Divider } from '@mui/material'
import React, { useContext } from 'react'
import { AvatorGroup } from './AvatorGroup'
import CommiButton from '@/components/CommiButton'
import Image from 'next/image'
import { GlobalContext } from '@/context/GlobalContext'

interface PoolInfoCardProps {
  tokenSupply?: string
  poolSize?: string
  poolSizeUsd?: string
  currentPrice?: string
  participants?: number
}

const PoolInfoCard = ({ address }: any) => {
  const { campaigns } = useContext(GlobalContext)
  const targetCapaign = campaigns.find((item: any) => item.address === address)

  const participantAvatars = [
    { id: 1, name: 'H', color: 'bg-red-500' },
    { id: 2, name: 'U', color: 'bg-blue-500' },
  ]

  return (
    <div className="flex w-[700px] bg-blue-950 rounded-2xl p-9 text-white relative overflow-hidden gap-8 justify-center items-center">
      <div>
        <Image width={215} height={280} src={'/images/SipCup.png'} alt="" />
      </div>
      <div className="space-y-4 flex flex-col">
        <p className="px-4 py-2 bg-blue-900 rounded-lg text-blue-200 font-bold text-sm">
          Total Supply: {targetCapaign.totalAmount}
        </p>
        <div className="flex items-center gap-2 font-bold text-lg w-full">
          <div className="w-1 h-4 bg-lime-400 rounded-full"></div>
          <span>Pool Size:</span>
          <span className="text-lime-400">{targetCapaign.poolSize}</span>
          <span className="-ml-1">
            {' '}
            ({((targetCapaign.poolSize / targetCapaign.totalAmount) * 100).toFixed(2)}%)
          </span>
          <span className="text-lime-400">≈ {targetCapaign.poolValue}Usd</span>
        </div>

        <div>
          <Divider className="bg-white" />
        </div>

        <div className="flex justify-end mt-4">
          <span className="font-medium text-sm">
            {targetCapaign.members.length} are sipping now
          </span>
          {/* <AvatorGroup members={[{ src: 'https://1.com' }, { src: 'https://2.com' }]} /> */}
        </div>

        <div className="flex justify-end">
          <div className="h-10 cursor-pointer rounded-full primary-linear w-60 font-bold text-base flex items-center justify-center text-black">
            Join Now
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoolInfoCard
