import CommiButton from '@/components/CommiButton'
import CommiModal from '@/components/CommiModal'
import CommiTypo from '@/components/CommiTypo'
import { XWithBorderIcon } from '@/components/icons/XWithBorderIcon'
import { customColors, primaryLinear } from '@/shared-theme/themePrimitives'
import { Box, Stack, styled } from '@mui/material'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

const StyledStack = styled(Stack)(() => ({
  borderRadius: '8px',
  position: 'absolute',
  backgroundColor: customColors.blue['500'],
  top: '1px',
  left: '1px',
  bottom: '1px',
  right: '1px',
}))

export const LoginButton = ({
  children,
  callbackUrl,
}: {
  children?: React.ReactNode
  callbackUrl?: string
}) => {
  const [openSignInModal, setOpenSignInModal] = React.useState(false)

  const connectWithX = async () => {
    try {
      // Call NextAuth to sign in with the "x" provider
      const result = await signIn('x', { redirect: false, callbackUrl })
      console.log('Sign in with X result:', result)
    } catch (error) {
      console.error('Sign in with X failed:', error)
      // Optionally, show an error message to the user
    }
  }

  const renderButton = () => {
    if (children && React.isValidElement(children)) {
      return React.cloneElement(children, {
        onClick: () => setOpenSignInModal(true),
      })
    }

    return (
      <CommiButton variant="outlined" size="small" onClick={() => setOpenSignInModal(true)}>
        Log in
      </CommiButton>
    )
  }

  return (
    <>
      {renderButton()}

      <CommiModal open={openSignInModal} onClose={() => setOpenSignInModal(false)} size="small">
        <Stack direction={'column'} alignItems="center" justifyContent="center" spacing={2}>
          <Image alt="" width={180} height={60} src={'/images/commiLogoAndFont.png'} />
          <CommiTypo color="white" type="heading-h1">
            Log in / Sign up
          </CommiTypo>
          <CommiTypo type="title" weight="semibold" color={customColors.blue[200]}>
            Link your Twitter and start earning rewards
          </CommiTypo>

          <Box
            sx={{
              width: '100%',
              position: 'relative',
              background: primaryLinear,
              borderRadius: '8px',
            }}
            height={'94px'}>
            <StyledStack
              sx={{ px: 3 }}
              direction={'row'}
              alignItems={'center'}
              justifyContent={'space-between'}>
              <Stack direction={'row'} alignItems={'center'} gap={2}>
                <XWithBorderIcon />
                <CommiTypo type="content" weight="semibold" color={customColors.main.White}>
                  Twitter
                </CommiTypo>
              </Stack>
              <CommiButton
                theme="primaryLinear"
                size="medium"
                sx={{ width: '160px' }}
                onClick={connectWithX}>
                Start
              </CommiButton>
            </StyledStack>
          </Box>
        </Stack>
      </CommiModal>
    </>
  )
}
