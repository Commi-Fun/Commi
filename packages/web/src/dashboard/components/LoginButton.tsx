import CommiButton from '@/components/CommiButton'
import CommiModal from '@/components/CommiModal'
import CommiTypo from '@/components/CommiTypo'
import { ArrowCircleRight } from '@/components/icons/ArrowCircleRight'
import { XWithBorderIcon } from '@/components/icons/XWithBorderIcon'
import { customColors, primaryLinear } from '@/shared-theme/themePrimitives'
import { Box, Stack, styled } from '@mui/material'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

const StyledStack = styled(Stack)(() => ({
  borderRadius: '8px',
  position: 'absolute',
  backgroundColor: customColors.blue[1000],
  top: '1px',
  left: '1px',
  bottom: '1px',
  right: '1px',
}))

export const LoginButton = ({
  children,
  callbackUrl,
}: {
  children?: React.ReactElement<{
    onClick?: () => void
  }>
  callbackUrl?: string
}) => {
  const [openSignInModal, setOpenSignInModal] = React.useState(false)

  const connectWithX = async () => {
    try {
      const result = await signIn('x', { redirect: false, callbackUrl })
      console.log('Sign in with X result:', result)
    } catch (error) {
      console.error('Sign in with X failed:', error)
    }
  }

  const renderButton = () => {
    if (children && React.isValidElement(children)) {
      return React.cloneElement(children, {
        onClick: () => setOpenSignInModal(true),
      })
    }

    return (
      <CommiButton size="small" onClick={() => setOpenSignInModal(true)}>
        Log in With X
      </CommiButton>
    )
  }

  return (
    <>
      {renderButton()}

      <CommiModal open={openSignInModal} onClose={() => setOpenSignInModal(false)} size="small">
        <Stack className="p-6" direction={'column'} alignItems="center" justifyContent="center">
          <div className="flex items-end gap-2">
            <Image alt="" width={33.78} height={57.49} src={'/images/logoBlackSroke.svg'} />
            <Image src="/Commi.svg" width={139} height={31} alt="logo"></Image>
          </div>
          <span className="text-green-300 text-[24px] font-extrabold">Log in / Sign up</span>
          <p className="font-semibold text-gray-400 text-[18px]">
            Link your Twitter and start earning rewards
          </p>

          <div className="h-[94px] rounded-2xl relative w-full">
            <div className="flex p-3 items-center justify-between bg-blue-1000 h-full rounded-lg">
              <Stack direction={'row'} alignItems={'center'} gap={2}>
                <XWithBorderIcon />
                <CommiTypo type="content" weight="semibold" color={customColors.main.White}>
                  Twitter
                </CommiTypo>
              </Stack>
              <CommiButton
                size="medium"
                className="bg-green-500 text-red-400 w-40"
                onClick={connectWithX}>
                <span>Start</span>
                <ArrowCircleRight className="text-[18px]" />
              </CommiButton>
            </div>
          </div>
        </Stack>
      </CommiModal>
    </>
  )
}
