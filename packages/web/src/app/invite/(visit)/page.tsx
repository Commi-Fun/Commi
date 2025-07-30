'use client'
import { ArrowCircleRight } from '@/components/icons/ArrowCircleRight'
import { LoginButton } from '@/dashboard/components/LoginButton'
import { REFERRAL_CODE_SEARCH_PARAM } from '@/lib/constants'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function InviteContent() {
  const router = useRouter()
  const { status, data } = useSession()
  const searchparams = useSearchParams()

  useEffect(() => {
    if (status !== 'authenticated') {
      return
    }

    const fff = async () => {
      const referralCode = searchparams.get(REFERRAL_CODE_SEARCH_PARAM)
      console.log('Processing referral code:', referralCode)
      if (referralCode) {
        try {
          console.log('Sending referral code to API:', referralCode)
          const response = await fetch('/api/whitelist/refer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              [REFERRAL_CODE_SEARCH_PARAM]: referralCode,
            }),
          })

          const result = await response.json()
          console.log('Referral API response:', result)
        } catch (e) {
          console.error(e)
        }
      }
      console.log('data?.user.status', data?.user.status)
      // if (data?.user.status === WhitelistStatus.CLAIMED) {
      //   router.push('/invite/finish')
      // } else {
      //   router.push('/invite/twoSteps')
      // }
    }
    fff()
  }, [router, status, searchparams, data?.user.status, data])

  const referrerCode = searchparams.get(REFERRAL_CODE_SEARCH_PARAM)

  const XCallbackUrl = referrerCode
    ? `/invite?${REFERRAL_CODE_SEARCH_PARAM}=${encodeURIComponent(referrerCode)}`
    : '/invite'

  console.log('XCallbackUrl', XCallbackUrl)

  return (
    <div className="relative overflow-hidden mt-35 px-2.5">
      <p className="stroke-black font-extrabold font-shadow-black text-white text-[46px] 2xl:text-[56px]">
        NEXT-GEN TOKEN DISTRIBUTION
      </p>
      <div className="flex gap-4 mt-8">
        <span className="button-transparent text-main-Black text-[1.5rem] 2xl-[28px]">
          EARLY PERKS
        </span>
        <span className="button-transparent text-main-Black text-[1.5rem] 2xl-[28px]">
          TEST ACCESS
        </span>
        <span className="button-transparent text-main-Black text-[1.5rem] 2xl-[28px]">
          FUTURE AIRDROP
        </span>
      </div>

      <div className="mt-30 2xl:mt-50">
        <LoginButton callbackUrl={XCallbackUrl}>
          <button className="bg-black text-white rounded-lg text-3xl font-bold flex items-center gap-2 drop-shadow-lg hover:bg-gray-800 transition-colors px-10 py-3 cursor-pointer">
            Get Now
            <ArrowCircleRight className={`text-[50px] text-main-Green01`} />
          </button>
        </LoginButton>
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<div className="relative overflow-hidden mt-35 px-2.5">Loading...</div>}>
      <InviteContent />
    </Suspense>
  )
}

export default Page
