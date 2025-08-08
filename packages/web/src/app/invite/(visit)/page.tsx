'use client'
import { ArrowCircleRight } from '@/components/icons/ArrowCircleRight'
import { SlideButton } from '@/components/SlideButton'
import { LoginButton } from '@/dashboard/components/LoginButton'
import { REFERRAL_CODE_SEARCH_PARAM } from '@/lib/constants'
import { WhitelistStatus } from '@/lib/services/whitelistService'
import { signIn, useSession } from 'next-auth/react'
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

    const fetchStatusAndRefer = async () => {
      const fetchArr = []
      fetchArr.push(fetch('/api/whitelist/check').then(response => response.json()))
      const referralCode = searchparams.get(REFERRAL_CODE_SEARCH_PARAM)
      if (referralCode) {
        fetchArr.push(
          fetch('/api/whitelist/refer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              [REFERRAL_CODE_SEARCH_PARAM]: referralCode,
            }),
          }).then(response => response.json()),
        )
      }
      try {
        const [result1] = await Promise.allSettled(fetchArr)
        if (result1.status === 'fulfilled') {
          console.log('result1.value.data.claimed', result1.value.data.claimed)
          if (result1.value.data?.claimed) {
            router.push('/invite/finish')
          } else {
            router.push('/invite/inProgress')
          }
        }
      } catch (e) {
        if (e instanceof Error) {
          console.error(`Failed to fetch whitelist status: ${e?.message}`)
        }
      }
    }
    fetchStatusAndRefer()
  }, [router, status, searchparams, data?.user.status, data])

  const referrerCode = searchparams.get(REFERRAL_CODE_SEARCH_PARAM)

  const XCallbackUrl = referrerCode
    ? `/invite?${REFERRAL_CODE_SEARCH_PARAM}=${encodeURIComponent(referrerCode)}`
    : '/invite'

  const connectWithX = async () => {
    try {
      const result = await signIn('x', { redirect: false, callbackUrl: XCallbackUrl })
      console.log('Sign in with X result:', result)
    } catch (error) {
      console.error('Sign in with X failed:', error)
    }
  }

  return (
    <>
      <div className="relative overflow-hidden mt-35 px-2.5">
        <p className="hidden lg:block stroke-black font-extrabold font-shadow-black text-white text-[46px] 2xl:text-[56px]">
          NEXT-GEN TOKEN DISTRIBUTION
        </p>
        <div className="hidden lg:flex gap-4 mt-8">
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
        <div className="hidden lg:block mt-30 2xl:mt-50">
          <LoginButton callbackUrl={XCallbackUrl}>
            <button className="bg-black text-white rounded-lg text-3xl font-bold flex items-center gap-2 drop-shadow-lg hover:bg-gray-800 transition-colors px-10 py-3 cursor-pointer">
              Get Now
              <ArrowCircleRight className={`text-[50px] text-main-Green01`} />
            </button>
          </LoginButton>
        </div>
      </div>
      {/* 移动端登录按钮 */}
      <div className="block absolute bottom-9 lg:hidden w-full px-10 left-0">
        <SlideButton onSlideComplete={connectWithX} />
      </div>
    </>
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
