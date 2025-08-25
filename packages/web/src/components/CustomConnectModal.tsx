'use client'

import * as React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import CommiModal from './CommiModal'
import Image from 'next/image'
import { ArrayRightMd } from './icons/ArrayRightMd'
import { useConnectUserMutation } from '@/query/query'
import { useSession } from 'next-auth/react'

interface CustomConnectModalProps {
  open: boolean
  onClose: () => void
}

export function CustomConnectModal({ open, onClose }: CustomConnectModalProps) {
  const { wallets, select, connect, publicKey, signMessage } = useWallet()
  const { data: session } = useSession()
  const connectUserMutation = useConnectUserMutation()

  const handleWalletConnect = async (walletName: string) => {
    try {
      const wallet = wallets.find(w => w.adapter.name === walletName)
      if (wallet) {
        // 1. 选择钱包
        select(wallet.adapter.name)

        // 2. 连接到钱包（这会弹出钱包授权界面）
        await connect()

        // 3. 等待连接完成后获取公钥和签名
        // Note: We need to wait for the connection to be established
        // The actual signing and API call will happen in a useEffect
        onClose()
      } else {
        console.log(`${walletName} wallet not available`)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  // Handle wallet connection and user connect mutation
  React.useEffect(() => {
    const handleUserConnect = async () => {
      if (publicKey && signMessage && session?.user?.userId) {
        try {
          // Create a message to sign
          const message = `Connect wallet ${publicKey.toBase58()} to Commi. Timestamp: ${Date.now()}`
          const messageBytes = new TextEncoder().encode(message)
          
          // Sign the message
          const signature = await signMessage(messageBytes)
          const signatureBase58 = Buffer.from(signature).toString('base64')
          
          // Call the connect user mutation
          await connectUserMutation.mutateAsync({
            address: publicKey.toBase58(),
            signature: signatureBase58
          })
          
          console.log('Wallet connected and user updated successfully')
        } catch (error) {
          console.error('Failed to connect user:', error)
        }
      }
    }

    handleUserConnect()
  }, [publicKey, signMessage, session?.user?.userId, connectUserMutation])

  return (
    <CommiModal open={open} onClose={onClose} size="medium">
      <div className="flex flex-col">
        <p className="text-[28px] font-extrabold mb-6">Connect Solana Wallet</p>

        <div className="flex flex-col gap-3">
          {wallets
            .filter(wallet => wallet.readyState === 'Installed' || wallet.readyState === 'Loadable')
            .map(wallet => {
              return (
                <button
                  key={wallet.adapter.name}
                  onClick={() => handleWalletConnect(wallet.adapter.name)}
                  className="
                    bg-green-500 text-black
                    flex items-center justify-between
                    p-6 rounded-lg
                    transition-all duration-200 ease-in-out
                    hover:bg-[#C9F572] hover:text-black
                    group
                    cursor-pointer
                  ">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center">
                      <Image
                        src={wallet.adapter.icon}
                        width={46}
                        height={46}
                        alt={`${wallet.adapter.name} icon`}
                        onError={e => {
                          // Fallback to default icon if wallet icon fails to load
                          e.currentTarget.src = '/wallet-icons/default.svg'
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-[18px]">{wallet.adapter.name}</span>
                      {wallet.readyState === 'Installed' && (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                          Installed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="transform transition-transform duration-200 group-hover:translate-x-1">
                    <ArrayRightMd className="text-[24px]" />
                  </div>
                </button>
              )
            })}

          {/* Show message if no wallets are available */}
          {wallets.filter(
            wallet => wallet.readyState === 'Installed' || wallet.readyState === 'Loadable',
          ).length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No Solana wallets detected</p>
              <p className="text-sm text-gray-500">
                Please install a Solana wallet like Phantom, Solflare, or others to continue.
              </p>
            </div>
          )}
        </div>
      </div>
    </CommiModal>
  )
}
