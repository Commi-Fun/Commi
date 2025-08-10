'use client'
import { REFERRAL_CODE_SEARCH_PARAM } from '@/lib/constants'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ReferralCodePage = () => {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const referalCode = params.referalCode as string

    if (referalCode) {
      // 将 referalCode 存储到 sessionStorage
      sessionStorage.setItem(REFERRAL_CODE_SEARCH_PARAM, referalCode)
    }

    // 重定向到 /invite 首页
    router.replace('/invite')
  }, [params.referalCode, router])

  // 显示加载状态
  return (
    <div className="relative overflow-hidden mt-35 px-2.5">
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Processing invitation...</div>
      </div>
    </div>
  )
}

export default ReferralCodePage
