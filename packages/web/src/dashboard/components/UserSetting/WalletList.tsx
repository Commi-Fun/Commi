import CommiButton from '@/components/CommiButton'
import CopyIcon from '@/components/icons/CopyIcon'
import { OkxIcon } from '@/components/icons/walletIcons/OkxIcon'
import { InteractiveBox } from '@/components/InteractiveBox'
import { useSolanaMultiWallet } from '@/hooks/useSolanaMultiWallet'
import truncateAddress from '@/lib/utils/truncateAddress'
import Image from 'next/image'

export const WalletList = () => {
  const { connectedWallets } = useSolanaMultiWallet()

  console.log('connectedWallets', connectedWallets)

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-4" style={{ rowGap: '20px' }}>
      {connectedWallets.map(wallet => (
        <InteractiveBox
          key={wallet.name}
          className="h-[50px] flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {/* <Image alt="" width={24} height={24} src={connectedWallets[wallet].icon} /> */}
            <span>{truncateAddress(wallet.address)}</span>
          </div>
          <CopyIcon className="text-lg" />
        </InteractiveBox>
      ))}
    </div>
  )
}
