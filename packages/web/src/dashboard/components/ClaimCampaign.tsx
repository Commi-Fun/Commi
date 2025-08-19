'use client'
import Image from 'next/image'
import CommiButton from '@/components/CommiButton'

interface ClaimCampaignProps {
  tokenName: string
  tokenPrice: string
  statusLabel: string
  statusValue: string
  buttonText: string
  tokenImage?: string
  disabled?: boolean
  variant?: 'filled' | 'outline'
  onClick?: () => void
}

const ClaimCampaign = ({
  tokenName,
  tokenPrice,
  statusLabel,
  statusValue,
  buttonText,
  tokenImage = '/Solana.png',
  disabled = false,
  variant = 'filled',
  onClick,
}: ClaimCampaignProps) => {
  return (
    <div className="p-0">
      <div
        onClick={onClick}
        className={`w-full flex items-center justify-between px-5 py-2 transition-opacity ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
        }`}>
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center ${
              disabled ? 'opacity-50' : ''
            }`}>
            <img className="dark:invert" src={tokenImage} alt="Token logo" width={36} height={36} />
          </div>
          <div className="flex flex-col items-start">
            <div
              className={`font-semibold text-sm ${disabled ? 'text-gray-400' : 'text-main-Black'}`}>
              {tokenName}
            </div>
            <div className={`font-medium text-xs ${disabled ? 'text-gray-400' : 'text-green-500'}`}>
              {tokenPrice}
            </div>
            <div className="flex">
              <span
                className={`font-medium text-xs ${disabled ? 'text-gray-400' : 'text-[#B8BCBD]'}`}>
                {statusLabel}
              </span>
              <span
                className={`font-medium text-xs ml-1 ${
                  disabled ? 'text-gray-400' : 'text-[#F3FBFF]'
                }`}>
                {statusValue}
              </span>
            </div>
          </div>
        </div>
        {!disabled && (
          <CommiButton size="small" variant={variant}>
            {buttonText}
          </CommiButton>
        )}
      </div>
    </div>
  )
}

export default ClaimCampaign
