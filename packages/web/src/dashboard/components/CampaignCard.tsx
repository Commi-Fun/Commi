import React from 'react'
import { WalletAddress } from './WalletAddress'
import { useRouter } from 'next/navigation'

function truncateMiddle(text: string): string {
  return text.slice(0, 6) + '...' + text.slice(-4)
}

interface Props {
  tokenName?: string
  tokenImage?: string
  address: string
  marketCap?: string
  changePercent?: number
  currentAmount?: number
  totalAmount?: number
  members: { src: string }[]
}

const CampaignCard = ({
  tokenName = 'Token Name',
  tokenImage = '/images/campaign_image.png',
  address,
  marketCap = '$123.45K',
  changePercent = 0,
  currentAmount = 0,
  totalAmount = 123.45,
  members,
}: any) => {
  const router = useRouter()
  const progressPercentage = totalAmount > 0 ? (currentAmount / totalAmount) * 100 : 0

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address)
      console.log('Address copied to clipboard')
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const handleCampaignClick = () => {
    router.push(`/detail/${address}`)
  }

  return (
    <div
      onClick={handleCampaignClick}
      className="bg-white rounded-3xl w-fit p-6 shadow-lg border border-gray-100 cursor-pointer">
      {/* Token Icon - Large centered */}
      <div className="flex justify-center mb-4">
        <div className="w-60 h-60 rounded-lg  flex items-center justify-center">
          <img src={tokenImage} alt="Token" className="w-60 h-60" />
        </div>
      </div>

      {/* Token Name */}
      <p className="text-lg font-bold text-black mb-2">{tokenName}</p>

      {/* Market Cap and Address Row */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-[0.875rem] font-bold text-red-600">MCap {marketCap}</span>

        <WalletAddress showIcon={false} address={address} />
      </div>

      {/* Change Percentage */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-md text-xs font-bold text-white ${
            changePercent >= 0 ? 'bg-green-500' : 'bg-red-500'
          }`}>
          {changePercent > 0 ? '+' : ''}
          {changePercent}%
        </span>
      </div>

      {/* Progress Section */}
      <div className="flex justify-between items-center mb-2">
        <div className="text-xl font-bold text-black">
          {currentAmount} <span className="text-gray-400 text-base">/ {totalAmount}K</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">{members.length} Joined</span>
          <div className="flex">
            {members.slice(0, 3).map((member: any, index: number) => (
              <img
                key={index}
                src={member.imgUrl}
                alt={`Member ${index + 1}`}
                className={`w-6 h-6 rounded-full border-2 border-white ${index > 0 ? '-ml-2' : ''}`}
                onError={e => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=User${index}&background=random`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-black h-3 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default CampaignCard
