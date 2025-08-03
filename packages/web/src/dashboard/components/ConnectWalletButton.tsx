import * as React from 'react'
import { Wallet } from '@solana/wallet-adapter-react'
import CommiModal from '@/components/CommiModal'
import CommiButton from '@/components/CommiButton'
import CommiTypo from '@/components/CommiTypo'
import { Stack } from '@mui/material'
import { customColors } from '@/shared-theme/themePrimitives'
import { ArrayRightMd } from '@/components/icons/ArrayRightMd'
import Image from 'next/image'
import truncateAddress from '@/lib/utils/truncateAddress'
import { useSolanaMultiWallet } from '@/hooks/useSolanaMultiWallet'
import { WalletName } from '@solana/wallet-adapter-base'

interface ItemProps {
  wallet: Wallet
  onClick: () => void
  status: 'connected' | 'active' | 'disconnected'
}

const WalletListItem = ({ wallet, onClick, status }: ItemProps) => {
  const isActive = status === 'active'
  const isConnected = status === 'connected' || isActive

  return (
    <Stack
      onClick={onClick}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        height: '94px',
        width: '100%',
        borderRadius: '8px',
        backgroundColor: customColors.blue[1300],
        padding: '0 24px',
        cursor: 'pointer',
        border: isActive ? `1px solid ${customColors.green01[600]}` : 'none',
        transition: 'background-color 0.2s, color 0.2s, border 0.2s',
        '& .wallet-name, & .wallet-arrow': {
          transition: 'color 0.2s',
        },
        '.wallet-arrow': { color: customColors.blue[300] },
        '&:hover': {
          backgroundColor: customColors.green01[300],
          '& .wallet-name, & .wallet-arrow': {
            color: customColors.main.White,
          },
        },
      }}>
      <Stack direction="row" alignItems="center" gap="16px">
        <Image src={wallet.adapter.icon} alt={wallet.adapter.name} width={46} height={46} />
        <CommiTypo
          className="wallet-name"
          type={'title'}
          weight="bold"
          color={customColors.blue[200]}>
          {wallet.adapter.name}
        </CommiTypo>
        {isConnected && (
          <CommiTypo
            type="body"
            color={isActive ? customColors.green01[600] : customColors.blue[300]}>
            {isActive ? '(Active)' : '(Connected)'}
          </CommiTypo>
        )}
      </Stack>
      <ArrayRightMd className="wallet-arrow" />
    </Stack>
  )
}

export default function ConnectWalletButton() {
  const [open, setOpen] = React.useState(false)
  const { availableWallets, connectedWallets, activeWallet, connectWallet, setActiveWallet } =
    useSolanaMultiWallet()

  const handleItemClick = (wallet: Wallet) => {
    const walletName = wallet.adapter.name
    // if (connectedWallets[walletName]) {
    //   setActiveWallet(walletName)
    // } else {
    //   connectWallet(walletName)
    // }
  }

  // const getWalletStatus = (walletName: WalletName): 'connected' | 'active' | 'disconnected' => {
  //   if (activeWallet?.name === walletName) {
  //     return 'active'
  //   }
  //   if (connectedWallets[walletName]) {
  //     return 'connected'
  //   }
  //   return 'disconnected'
  // }

  return (
    <>
      <CommiModal open={open} onClose={() => setOpen(false)} title="Connect or Switch Wallet">
        <Stack gap={2}>
          {availableWallets
            // .filter(wallet => wallet.readyState === 'Installed')
            .map(wallet => (
              <WalletListItem
                key={wallet.adapter.name}
                wallet={wallet}
                onClick={() => handleItemClick(wallet)}
                status={'connected'}
              />
            ))}
        </Stack>
      </CommiModal>

      {/* {activeWallet ? (
        <CommiButton size={'small'} variant={'outlined'} onClick={() => setOpen(true)}>
          {truncateAddress(activeWallet.address)}
        </CommiButton>
      ) : (
        <CommiButton size={'small'} variant={'outlined'} onClick={() => setOpen(true)}>
          Connect Wallet
        </CommiButton>
      )} */}
      <CommiButton size={'small'} variant={'outlined'} onClick={() => setOpen(true)}>
        Connect Wallet
      </CommiButton>
    </>
  )
}
