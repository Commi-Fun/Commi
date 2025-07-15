import MainGrid from '@/dashboard/components/MainGrid'
import { Metadata } from 'next'
import { UserProfile } from '@/components/UserProfile'
import { LoginButton } from '@/components/LoginButton'
import { Box } from '@mui/material'

export const metadata: Metadata = {
  title: 'Commi',
  icons: {
    icon: '/logo.svg',
  },
}

const Page = () => {
  return (
    <>
      {/* <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <UserProfile />
        <LoginButton />
      </Box> */}
      <MainGrid />
    </>
  )
}

export default Page
