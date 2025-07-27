'use client'
import { ArrowCircleRight } from '@/components/icons/ArrowCircleRight'
import { LoginButton } from '@/dashboard/components/LoginButton'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const router = useRouter()
  const { status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/invite/twoSteps')
    }
  }, [router, status])

  return (
    <div className="relative overflow-hidden mt-35 ml-25">
      <p className="stroke-black font-extrabold font-shadow-black text-white text-[56px]">
        NEXT-GEN TOKEN DISTRIBUTION
      </p>
      <div className="flex gap-4 mt-8">
        <span className="button-transparent text-main-Black">EARLY PERKS</span>
        <span className="button-transparent text-main-Black">TEST ACCESS</span>
        <span className="button-transparent text-main-Black">FUTURE AIRDROP</span>
      </div>

      <div className="mt-50">
        <LoginButton callbackUrl="/invite">
          <button className="bg-black rounded-lg text-white rounded-lg text-3xl font-bold flex items-center gap-2 drop-shadow-lg hover:bg-gray-800 transition-colors px-10 py-3 cursor-pointer">
            Get Now
            <ArrowCircleRight className={`text-[50px] text-main-Green01`} />
          </button>
        </LoginButton>
      </div>
    </div>
  )
}

export default Page
