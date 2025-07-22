'use client'
import { ArrowCircleRight } from '@/components/icons/ArrowCircleRight'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const isLogin = false
const Page = () => {
  const router = useRouter()

  useEffect(() => {
    if (isLogin) {
      router.push('/invite/twoSteps')
    }
  }, [router])

  const handleGetNowClick = () => {
    router.push('/invite/twoSteps')
  }

  return (
    <div className="min-h-screen relative overflow-hidden px-20 py-10">
      <div className="px-6">
        <p className="stroke-black font-extrabold font-shadow-black text-white text-[56px]">
          NEXT-GEN TOKEN DISTRIBUTION
        </p>

        <div className="flex gap-4 mt-8">
          <span className="button-transparent text-main-Black">EARLY PERKS</span>
          <span className="button-transparent text-main-Black">TEST ACCESS</span>
          <span className="button-transparent text-main-Black">FUTURE AIRDROP</span>
        </div>

        {/* Get Now Button */}
        <div className="mt-50">
          <button
            onClick={handleGetNowClick}
            className="bg-black rounded-lg text-white rounded-lg text-3xl font-bold flex items-center gap-2 drop-shadow-lg hover:bg-gray-800 transition-colors px-10 py-3 cursor-pointer">
            Get Now
            <ArrowCircleRight className={`text-[50px] text-main-Green01`} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page
