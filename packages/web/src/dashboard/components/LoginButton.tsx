import CommiButton from '@/components/CommiButton'
import CommiModal from '@/components/CommiModal'
import CommiTypo from '@/components/CommiTypo'
import { ArrowCircleRight } from '@/components/icons/ArrowCircleRight'
import { XWithBorderIcon } from '@/components/icons/XWithBorderIcon'
import { customColors } from '@/shared-theme/themePrimitives'
import { Stack } from '@mui/material'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

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
      const result = await signIn('x', { redirect: true, callbackUrl })
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
        <Stack className="" direction={'column'} alignItems="center" justifyContent="center">
          <div className="flex items-end gap-2">
            <Image alt="" width={33.78} height={57.49} src={'/images/logoBlackSroke.svg'} />
            <Image src="/Commi.svg" width={139} height={31} alt="logo"></Image>
          </div>
          <span className="text-lime-500 text-[24px] font-extrabold mt-3">Log in / Sign up</span>
          <p className="font-semibold text-gray-400 text-[18px]">
            Link your Twitter and start earning rewards
          </p>

          <div className="h-[94px] rounded-lg relative w-full bg-blue-100 mt-8">
            <div className="flex py-3 px-6 items-center justify-between bg-blue-1000 h-full rounded-lg">
              <Stack direction={'row'} alignItems={'center'} gap={2}>
                <XWithBorderIcon />
                <CommiTypo type="content" weight="semibold" color={customColors.main.White}>
                  Twitter
                </CommiTypo>
              </Stack>
              <CommiButton size="medium" onClick={connectWithX} className="rounded-lg w-30">
                <span className="text-lg font-bold">Start</span>
                <ArrowCircleRight className="text-[18px]" />
              </CommiButton>
            </div>
          </div>
        </Stack>
      </CommiModal>
    </>
  )
}
