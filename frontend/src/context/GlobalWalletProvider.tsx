// @/context/GlobalWalletProvider.tsx
'use client'

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletStore, ConnectedSolanaWallet } from '@/store/walletStore'

// Create a context to hold the store's state and actions
const GlobalWalletContext = createContext(useWalletStore.getState());

export const useGlobalWallet = () => {
  return useContext(GlobalWalletContext)
}

export const GlobalWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useWalletStore()
  const { connected, publicKey, wallet, select } = useWallet()
  const isHandlingConnection = useRef(false)

  useEffect(() => {
    // This effect syncs the underlying provider with the active wallet from the store
    if (store.activeWalletName && wallet?.adapter.name !== store.activeWalletName) {
      select(store.activeWalletName)
    }
  }, [store.activeWalletName, wallet, select])

  useEffect(() => {
    // This effect adds a newly connected wallet to our global store
    if (connected && publicKey && wallet && !isHandlingConnection.current) {
      isHandlingConnection.current = true
      const newWallet: ConnectedSolanaWallet = {
        name: wallet.adapter.name,
        address: publicKey.toBase58(),
        icon: wallet.adapter.icon,
      }
      // Add to the store only if it's not already there
      if (!store.connectedWallets[newWallet.name]) {
        store.actions.addWallet(newWallet)
      } else {
        // If it is already there, just make sure it's active
        store.actions.setActiveWalletName(newWallet.name)
      }
      
      setTimeout(() => {
        isHandlingConnection.current = false
      }, 100) // a small delay to prevent race conditions
    }
  }, [connected, publicKey, wallet, store.actions, store.connectedWallets])

  return (
    <GlobalWalletContext.Provider value={store}>
      {children}
    </GlobalWalletContext.Provider>
  )
}
