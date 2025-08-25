import * as React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import CommiButton from '@/components/CommiButton'
import { CustomConnectModal } from '@/components/CustomConnectModal'
import truncateAddress from '@/lib/utils/truncateAddress'



export default function ConnectWalletButton() {
  const [open, setOpen] = React.useState(false)
  const { publicKey, connected, disconnect } = useWallet()

  const handleDisconnect = async () => {
    try {
      await disconnect()
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

  return (
    <>
      {connected && publicKey ? (
        <CommiButton 
          size={'small'} 
          variant={'outline'} 
          onClick={handleDisconnect}
        >
          {truncateAddress(publicKey.toBase58())}
        </CommiButton>
      ) : (
        <CommiButton size={'small'} onClick={() => setOpen(true)}>
          Connect Wallet
        </CommiButton>
      )}
      
      <CustomConnectModal 
        open={open} 
        onClose={() => setOpen(false)} 
      />
    </>
  )
}
