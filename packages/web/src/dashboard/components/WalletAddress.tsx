import CopyIcon from '@/components/icons/CopyIcon'
import truncateAddress from '@/lib/utils/truncateAddress'
import { useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'

export const WalletAddress = ({ showIcon, address }: { showIcon?: boolean; address: string }) => {
  const { connect, publicKey, wallet, ...rest } = useWallet()
  console.log('wallet', wallet)
  console.log('rest', rest)

  const copyToClipboard = async () => {
    navigator.clipboard.writeText(address)
  }

  return (
    <div className="flex gap-2 items-center">
      {showIcon && <Image src={wallet?.adapter.icon || ''} width={24} height={24} alt={''} />}

      <span className="text-gray-500 text-xs">{truncateAddress(address)}</span>
      <CopyIcon onClick={copyToClipboard} className="text-[14px] text-gray-500 cursor-pointer" />
    </div>
  )
}
