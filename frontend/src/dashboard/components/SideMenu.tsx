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
import Typo from '@/components/Typo'
import CommiButton from '@/components/CommiButton'

const user = {
  twitter: {},
  wallet: {
    name: 'Riley Carter',
    address: '0x1234567890abcdef1234567890abcdef12345678s',
  },
}

const ProfileInfo = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'bold',
            fontSize: '1.125rem',
          }}>
          {user?.wallet?.name}
        </Typography>
        <SettingsIcon
          fontSize={'medium'}
          sx={{
            position: 'absolute',
            top: '6px',
            right: '16px',
            color: 'gray',
          }}
        />
      </Stack>

      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {truncateAddress(user?.wallet?.address)}
      </Typography>
    </Box>
  )
}

const UnloginProfileInfo = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Typo type="heading" color="white">
          Guest
        </Typo>
        <CommiButton variant="outlined" size="small" theme="primary">
          Log in
        </CommiButton>
      </Stack>
    </Box>
  )
}

const isAuthenticated = true
export default function SideMenu() {
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
          src="https://images.steamusercontent.com/ugc/1637611602253477558/8D6958D1C1CF006D6D461206E0059C1FD4D00B2A/?imw=637&imh=358&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true"
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
