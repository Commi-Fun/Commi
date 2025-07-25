import CommiButton from '@/components/CommiButton'
import { CommiDivider } from '@/components/CommiDivider'
import CommiModal from '@/components/CommiModal'
import CommiTypo from '@/components/CommiTypo'
import { ExitIcon } from '@/components/icons/ExitIcon'
import { SettingIcon } from '@/components/icons/SettingIcon'
import { WalletIcon } from '@/components/icons/WalletIcon'
import { Avatar, Divider, Stack } from '@mui/material'
import { WalletName } from '@solana/wallet-adapter-base'
import { useWallet } from '@solana/wallet-adapter-react'
import { sign } from 'crypto'
import { signOut, useSession } from 'next-auth/react'
import React, { useMemo } from 'react'
import { NoWallet } from './NoWallet'
import { WalletList } from './WalletList'
import ConnectWalletButton from '../ConnectWalletButton'
import { useSolanaMultiWallet } from '@/hooks/useSolanaMultiWallet'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'

interface UserSettingProps {
  onClick: () => void
}

export const UserSetting = () => {
  const [open, setOpen] = React.useState(false)
  const { data } = useSession()
  const { image: userImage, name, username, ...rest } = data?.user || {}
  const { connectedWallets } = useSolanaMultiWallet()

  const { select, connect } = useWallet()

  const phantomAdapter = useMemo(() => new PhantomWalletAdapter(), [])

  return (
    <>
      <SettingIcon
        style={{
          position: 'absolute',
          top: '6px',
          right: '16px',
          color: 'gray',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(true)}
      />
      <CommiModal size="medium" open={open} onClose={() => setOpen(false)}>
        <Stack>
          <Stack mt={5} direction="column" alignItems="center" justifyContent="center">
            <Avatar
              alt="Riley Carter"
              src={userImage || ''}
              sx={{ width: 64, height: 64, border: '3px solid #fff' }}
            />
            <CommiTypo type="title" weight="bold" mt={2}>
              {name}
            </CommiTypo>
            <CommiTypo colorType="secondary" mt={1}>
              @{username}
            </CommiTypo>
          </Stack>
          <Stack direction={'row'} alignItems="center" justifyContent="space-between" mt={4.5}>
            <CommiTypo type={'heading-alert3'} colorType="secondary">
              My Wallet
            </CommiTypo>
            <ConnectWalletButton />
          </Stack>
          {/* <CommiButton onClick={() => phantomAdapter.disconnect()}>disconnect phantom</CommiButton> */}
          <div className="py-[24px]">
            <WalletList />
          </div>
          <Stack mt={6}>
            <CommiDivider />
            <Stack
              direction={'row'}
              gap={1}
              sx={{ cursor: 'pointer' }}
              onClick={() => signOut()}
              mt={3}>
              <ExitIcon />
              <CommiTypo type={'body'} colorType={'secondary'}>
                Log out Twitter
              </CommiTypo>
            </Stack>
          </Stack>
        </Stack>
      </CommiModal>
    </>
  )
}
