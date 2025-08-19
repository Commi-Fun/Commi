'use client'
import * as React from 'react'
import Avatar from '@mui/material/Avatar'
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
      <div className="w-full">
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
  const userImage =
    args.data?.user?.image ||
    'https://images.steamusercontent.com/ugc/1637611602253477558/8D6958D1C1CF006D6D461206E0059C1FD4D00B2A/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true'

  return (
    <div className="w-75 border-r-main-Black border-r">
      <div className="w-full h-25 flex items-center px-5 border-b-lime-700 border-b">
        <Avatar alt="Riley Carter" src={userImage} sx={{ width: 48, height: 48 }} />
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
