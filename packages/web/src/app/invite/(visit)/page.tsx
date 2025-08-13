'use client'
import { ArrowCircleRight } from '@/components/icons/ArrowCircleRight'
import { SlideButton } from '@/components/SlideButton'
import { LoginButton } from '@/dashboard/components/LoginButton'
import { REFERRAL_CODE_SEARCH_PARAM } from '@/lib/constants'
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
      const storedReferralCode = sessionStorage.getItem(REFERRAL_CODE_SEARCH_PARAM)
      const searchReferralCode = searchparams.get(REFERRAL_CODE_SEARCH_PARAM)
      const code = storedReferralCode || searchReferralCode

      if (code) {
        fetchArr.push(
          fetch('/api/whitelist/refer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              [REFERRAL_CODE_SEARCH_PARAM]: code,
            }),
          }).then(response => response.json()),
        )
      }
      try {
        const [result1, result2] = await Promise.allSettled(fetchArr)
        if (result1.status === 'fulfilled') {
          console.log('result1.value.data.claimed', result1.value.data.claimed)
          if (result1.value.data?.claimed) {
            router.push('/invite/finish')
          } else {
            router.push('/invite/inProgress')
          }
        }
        if (result2.status !== 'fulfilled') {
          console.error('Failed to fetch referral status')
        }
      } catch (e) {
        if (e instanceof Error) {
          console.error(`Failed to fetch whitelist status: ${e?.message}`)
        }
      }
    }
    fetchStatusAndRefer()
  }, [router, status, data?.user.status, data, searchparams])

  const XCallbackUrl = '/invite'

  const connectWithX = async () => {
    try {
      await signIn('x', { redirect: false, callbackUrl: XCallbackUrl })
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to sign in with X: ${error?.message}`)
      }
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
