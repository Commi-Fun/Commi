import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { WalletName } from '@solana/wallet-adapter-base'

export interface ConnectedSolanaWallet {
  name: WalletName
  address: string
  icon: string
}

interface WalletState {
  connectedWallets: Array<ConnectedSolanaWallet>
  activeWalletName: WalletName | null
  actions: {
    addWallet: (wallet: ConnectedSolanaWallet) => void
    removeWallet: (walletName: WalletName) => void
    setActiveWalletName: (walletName: WalletName | null) => void
    clearWallets: () => void
  }
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      connectedWallets: [],
      activeWalletName: null,
      actions: {
        addWallet: wallet => {
          set(state => ({
            connectedWallets: [...state.connectedWallets, wallet],
            activeWalletName: wallet.name, // Always set the new wallet as active
          }))
        },
        removeWallet: walletName => {
          const ccc = get().connectedWallets
          const foundIndex = ccc.findIndex(item => item.name === walletName)
          if (!foundIndex) return
          ccc.splice(foundIndex, 1)
          set({
            connectedWallets: [...ccc],
          })
        },
        setActiveWalletName: walletName => set({ activeWalletName: walletName }),
        clearWallets: () => set({ connectedWallets: [], activeWalletName: null }),
      },
    }),
    {
      name: 'solana-multi-wallet-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      // Only persist the state, not the actions
      partialize: state => ({
        connectedWallets: state.connectedWallets,
        activeWalletName: state.activeWalletName,
      }),
    },
  ),
)

// Export actions separately for easier usage in non-component files if needed
export const walletActions = useWalletStore.getState().actions
