import React from 'react'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import Avatar from '@mui/material/Avatar'
import { XIcon } from '@/components/icons/XIcon'
import Users from '@/components/icons/Users'
import { WalletAddress } from './WalletAddress'
import { AlarmIcon } from '@/components/icons/AlarmIcon'
import moment from 'moment'
import { CampaignResponseDto } from '@/types/dto'

interface Props {
  campaign?: CampaignResponseDto
}

const CampaignDetailCard = ({ campaign }: Props) => {
  // Extract values from campaign object
  const tokenName = campaign?.tokenName || 'Token Name'
  const tokenImage = '/images/campaign_image.png' // Default image
  const address = campaign?.tokenAddress
  const marketCap = campaign?.marketCap ? `$${Number(campaign?.marketCap) / 1000}K` : '$0K'
  const description = campaign?.description || 'No description available'
  const createdBy = `Creator ID: ${campaign?.creator?.userId}`
  const startDate = moment(campaign?.startTime || 0).format('YYYY/MM/DD HH:mm')
  const endDate = moment(campaign?.endTime || 0).format('YYYY/MM/DD HH:mm')

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address || '')
      console.log('Address copied to clipboard')
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  return (
    <div className="rounded-2xl">
      <div className="flex gap-6">
        {/* Token Icon */}
        <div className="">
          <div className="w-32 h-32 rounded-2xl bg-green-500 flex items-center justify-center relative overflow-hidden">
            <img
              src={tokenImage}
              alt={tokenName}
              className="w-20 h-20 object-contain"
              onError={e => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        </div>

        {/* Token Info */}
        <div className="flex-1">
          {/* Title and Icons */}
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-[2rem] font-extrabold text-black">{tokenName}</h1>
            <div className="flex items-center gap-2">
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                }}
                src={'/images/fire.png'}
              />
              <div className="flex items-center px-2">
                <div className="w-[1px] h-4 bg-gray-400"></div>
              </div>
              <XIcon className="text-[22px] text-gray-600" />
              <Users className="text-[22px] text-gray-600" />
            </div>
          </div>

          {/* Market Cap and Address */}
          <div className="flex items-center gap-4 mb-3">
            <span className="text-lg font-bold text-lime-300">MCap {marketCap}</span>
            <WalletAddress address={address || ''} />
          </div>

          {/* Description */}
          <p className="text-black mb-4 leading-relaxed font-medium text-sm">{description}</p>

          {/* Campaign Details */}
          <div className="space-y-2 text-sm bg-gray-100 rounded-3xl p-6">
            <div className="flex items-center gap-2">
              <div className="w-[6] h-[6] bg-lime-400 rounded-full"></div>
              <span className="text-black font-semibold text-lg">Created by:</span>
              <span className="font-medium">{createdBy}</span>
              <XIcon className="text-2xl text-gray-600" />
            </div>

            <div className="flex items-center gap-1 text-black">
              <span>
                {startDate} - {endDate}
              </span>
              <AlarmIcon className="text-lg text-lime-500" />
              <span>All Rewards Ending In</span>
              <span className="font-bold text-lime-500">1D : 2H</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetailCard
