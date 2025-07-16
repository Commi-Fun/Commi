'use client'
import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import { drawerClasses } from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import MenuContent from './MenuContent'
import JoinedCampaignList from './JoinedCampainList'
import { customColors } from '@/shared-theme/themePrimitives'
import SettingsIcon from '@mui/icons-material/Settings'
import Image from 'next/image'
import truncateAddress from '@/utils/truncateAddress'
import Typo from '@/components/CommiTypo'
import CommiButton from '@/components/CommiButton'
import SignInModal from './SignInModal'
import { signOut, useSession } from 'next-auth/react'
import { CustomConnectModal } from '@/components/CustomConnectModal'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { cookieStorage, useAccount, useDisconnect } from 'wagmi'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import ConnectWalletButton from './ConnectWalletButton'
import { useWallet } from '@solana/wallet-adapter-react'
import { LoginButton } from './LoginButton'

const ProfileInfo = () => {
  const { data: session } = useSession()
  // const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)
  const [isConnectModalOpen, setConnectModalOpen] = React.useState(false)
  const { connected, publicKey, ...rest } = useWallet()

  console.log('rest', rest)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleConnectWallet = () => {
    setConnectModalOpen(true)
    handleMenuClose()
  }

  const handleDisconnect = () => {
    disconnect()
    handleMenuClose()
  }

  return (
    <>
      <CustomConnectModal open={isConnectModalOpen} onClose={() => setConnectModalOpen(false)} />
      <Box sx={{ width: '100%' }}>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Stack>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                fontSize: '1.125rem',
              }}>
              {session?.user?.name}
            </Typography>
            {cookieStorage && publicKey && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {truncateAddress(publicKey.toBase58())}
              </Typography>
            )}
          </Stack>
          <SettingsIcon
            fontSize={'medium'}
            sx={{
              position: 'absolute',
              top: '6px',
              right: '16px',
              color: 'gray',
              cursor: 'pointer',
            }}
            onClick={handleMenuOpen}
          />
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}>
            {connected ? (
              <MenuItem onClick={handleDisconnect}>Disconnect Wallet</MenuItem>
            ) : (
              <MenuItem onClick={handleConnectWallet}>Connect with wallet</MenuItem>
            )}
          </Menu>
        </Stack>
      </Box>
    </>
  )
}

const UnloginProfileInfo = () => {
  const [openSignInModal, setOpenSignInModal] = React.useState(false)

  return (
    <Box sx={{ width: '100%' }}>
      <SignInModal open={openSignInModal} handleClose={() => setOpenSignInModal(false)} />
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Typo type="title" weight="bold" color="white">
          Guest
        </Typo>
        <LoginButton />
      </Stack>
    </Box>
  )
}

export default function SideMenu() {
  const args = useSession()

  const isAuthenticated = args.status === 'authenticated'
  const userImage =
    args.data?.user?.image ||
    'https://images.steamusercontent.com/ugc/1637611602253477558/8D6958D1C1CF006D6D461206E0059C1FD4D00B2A/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true'

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {},
        backgroundColor: customColors.blue['1200'],
        borderTopRightRadius: '40px',
        borderBottomRightRadius: '40px',
        borderRight: `1px solid ${customColors.blue['500']}`,
        paddingRight: '1px',
        backgroundClip: 'padding-box',
        width: '266px',
      }}>
      <CommiButton
        size="small"
        onClick={() => {
          signOut()
        }}>
        log out
      </CommiButton>
      <CommiButton size="small">Connect Wallet</CommiButton>
      <ConnectWalletButton></ConnectWalletButton>
      <Stack direction={'row'} alignItems={'end'} paddingX={2.5} py={3}>
        <Image src="/logo.svg" width={20} height={30} alt="logo"></Image>
        <Image src="/Commi.svg" width={76.8} height={17} alt="logo"></Image>
        <Image
          style={{ marginLeft: '8px' }}
          src="/mvp.svg"
          width={57}
          height={25}
          alt="logo"></Image>
      </Stack>
      <Stack
        direction="row"
        sx={{
          gap: 1,
          alignItems: 'center',
          mt: 1,
          position: 'relative',
        }}
        paddingX={2}>
        <Avatar
          alt="Riley Carter"
          src={userImage}
          sx={{ width: 64, height: 64, border: '3px solid #fff' }}
        />
        {isAuthenticated ? <ProfileInfo /> : <UnloginProfileInfo />}
      </Stack>

      <Box
        sx={{
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          mt: 2,
        }}>
        <MenuContent />
      </Box>
      <Stack paddingX={2.5} pt={3} pb={2}>
        <Divider />
      </Stack>
      <Box
        sx={{
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <JoinedCampaignList />
      </Box>
    </Box>
  )
}
