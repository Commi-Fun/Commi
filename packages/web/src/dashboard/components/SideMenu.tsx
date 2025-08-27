'use client'
import * as React from 'react'
import Box from '@mui/material/Box'
import JoinedCampaignList from './JoinedCampainList'
import CommiButton from '@/components/CommiButton'
import SignInModal from './SignInModal'
import { useSession } from 'next-auth/react'
import { CustomConnectModal } from '@/components/CustomConnectModal'
import { useWallet } from '@solana/wallet-adapter-react'
import { LoginButton } from './LoginButton'
import { ArrowCircleRight } from '@/components/icons/ArrowCircleRight'
import { WalletAddress } from './WalletAddress'

const ProfileInfo = () => {
  const { data: session } = useSession()

  const [isConnectModalOpen, setConnectModalOpen] = React.useState(false)
  const { connected, publicKey } = useWallet()
  console.log('connected', connected)
  console.log('public key', publicKey)

  return (
    <>
      <CustomConnectModal open={isConnectModalOpen} onClose={() => setConnectModalOpen(false)} />
      <div className="grow">
        <div className="flex flex-col pl-2 gap-2">
          <div className="flex gap-2">
            <p className="font-bold text-[18px]">{session?.user?.name}</p>
          </div>
          <div>
            {connected && publicKey ? (
              <WalletAddress address={publicKey.toBase58()} showIcon={false} />
            ) : (
              <CommiButton
                onClick={() => setConnectModalOpen(true)}
                size="small"
                className="w-full bg-lime-400 text-main-Black">
                <span className="font-semibold">Connect Wallet</span>
                <ArrowCircleRight />
              </CommiButton>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const UnloginProfileInfo = () => {
  const [openSignInModal, setOpenSignInModal] = React.useState(false)

  return (
    <div className="flex grow pl-2 justify-between">
      <SignInModal open={openSignInModal} handleClose={() => setOpenSignInModal(false)} />
      <span className="text-[18px] font-bold">Guest</span>
      <LoginButton />
    </div>
  )
}

export default function SideMenu() {
  const args = useSession()

  const isAuthenticated = args.status === 'authenticated'
  const userImage = args.data?.user?.image || '/images/unauthHead.png'

  return (
    <div className="w-75 border-r-main-Black border-r shrink-0">
      <div className="w-full h-25 flex items-center px-5 border-b-lime-700 border-b">
        <div className="rounded-full w-12 h-12 overflow-hidden">
          <img src={userImage} alt="" width={48} height={48} />
        </div>
        {isAuthenticated ? <ProfileInfo /> : <UnloginProfileInfo />}
      </div>
      <Box
        sx={{
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <JoinedCampaignList />
      </Box>
    </div>
  )
}
