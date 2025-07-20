// @/hooks/useSolanaMultiWallet.ts
import { useWallet } from '@solana/wallet-adapter-react'
import { useGlobalWallet } from '@/context/GlobalWalletProvider'
import { useCallback, useMemo } from 'react'
import { WalletName } from '@solana/wallet-adapter-base'
import { walletActions } from '../store/walletStore'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'

export const useSolanaMultiWallet = () => {
  const {
    connectedWallets,
    activeWalletName,
    actions: { setActiveWalletName, removeWallet, addWallet },
  } = useGlobalWallet()

  const phantomAdapter = useMemo(() => new PhantomWalletAdapter(), [])

  const { wallets } = useWallet()

  const connectWallet = useCallback(
    async (walletName: WalletName) => {
      await phantomAdapter.connect()
      addWallet({
        name: walletName,
        address: phantomAdapter.publicKey?.toBase58() || '',
        icon: phantomAdapter.icon,
      })
    },
    [addWallet, phantomAdapter],
  )

  return {
    // State
    connectedWallets,
    activeWallet: '',
    availableWallets: wallets,

    // Actions
    connectWallet,
    setActiveWallet: setActiveWalletName,
    disconnectWallet: removeWallet,
  }
}
