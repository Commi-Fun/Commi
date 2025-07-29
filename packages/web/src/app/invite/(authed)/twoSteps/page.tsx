'use client'
import CommiButton from '@/components/CommiButton'
import CheckBig from '@/components/icons/CheckBig'
import CopyIcon from '@/components/icons/CopyIcon'
import RedoIcon from '@/components/icons/RedoIcon'
import { REFERRAL_CODE_SEARCH_PARAM } from '@/lib/constants'
import { WhitelistStatus } from '@/lib/services/whitelistService'
import { customColors } from '@/shared-theme/themePrimitives'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const STATUS_MAP = {
  [WhitelistStatus.REGISTERED]: 1,
  [WhitelistStatus.POSTED]: 2,
  [WhitelistStatus.REFERRED]: 3,
  [WhitelistStatus.CLAIMED]: 4,
}

const Page = () => {
  const [copied, setCopied] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const router = useRouter()
  const { data } = useSession()

  const [status, setStatus] = useState<'REGISTERED' | 'CLAIMED'>('REGISTERED')
  const statusNumber = STATUS_MAP[status] || 0

  const copyText = `🧃Airdrop season's coming. I'm in Commi @commidotfun early — whitelist now or regret later: https://commi.fun?${REFERRAL_CODE_SEARCH_PARAM}=${data?.user.referralCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000) // 2秒后重置状态
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  useEffect(() => {
    setInterval(() => {
      fetch('/api/whitelist/check')
        .then(value => value.json())
        .then(value => {
          setStatus(value.data.status)
        })
        .catch(error => {
          console.error('Failed to check:', error)
        })
    }, 3000)
  }, [])

  const handleCheck = async () => {
    if (isSpinning) return // 防止重复点击
    setIsSpinning(true)
    try {
      const result = await fetch('/api/whitelist/check')
      const data = await result.json()
      setStatus(data.data.status)
    } catch (err) {
      console.error('Failed to check:', err)
    }

    setIsSpinning(false)
  }

  const claim = async () => {
    const result = await fetch('/api/whitelist/claim', {
      method: 'POST',
    })
    await result.json()
    router.push('/invite/finish')
  }

  const handlePostToTwitter = () => {
    const tweetText =
      "🧃Airdrop season's coming. I'm in Commi @commidotfun early — whitelist now or regret later!"
    const websiteUrl = 'https://commi.fun'
    const hashtags = 'Commi,Airdrop,Crypto'

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(websiteUrl)}&hashtags=${encodeURIComponent(hashtags)}`

    window.open(twitterUrl, '_blank')

    setTimeout(() => {
      fetch('/api/whitelist/post').catch(err => {
        console.error('Failed to post:', err)
      })
    }, 3000)
  }

  return (
    <div className="">
      <p className="text-[46px] 2xl:text-[72px] text-main-Black font-extrabold font-shadow-white">
        2 STEPS
      </p>
      <p className="text-white font-extrabold font-shadow-black text-[46px] 2xl:text-[72px] stroke-black mt-1.5">
        GET WHITELIST EARLY!
      </p>
      <div className="flex items-center justify-between w-full mt-15 2xl:mt-30">
        <div className="flex items-center gap-4">
          <span className="w-4 h-4 rounded-full bg-main-Green04"></span>
          <span className="text-2xl font-extrabold text-main-Black">Complete Tasks</span>
        </div>
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleCheck}>
          <RedoIcon
            color={customColors.green01[200]}
            fontSize={28}
            className={`${isSpinning ? 'animate-spin' : ''}`}
          />
          <span className="text-green01-200 text-[24px] font-bold">Check</span>
        </div>
      </div>

      <div className="h-[360px] py-[50px] 2xl:py-[70px] relative pl-11">
        <div
          className={`absolute left-1.5 top-0 bottom-0 w-1 ${statusNumber >= 3 ? 'bg-main-Green04' : 'bg-green01-900'} rounded-full`}></div>
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            {statusNumber >= 2 ? (
              <div className="w-6 h-6 bg-main-Green01 rounded-full flex items-center justify-center">
                <CheckBig className="text-main-Black text-[1.125rem]" />
              </div>
            ) : (
              <span
                style={{ borderWidth: '2px' }}
                className="w-6 h-6 rounded-full border-solid border-main-Black w-4 h-4"></span>
            )}
            <span className="font-bold text-[1.125rem] cursor-pointer">Post to Join</span>
          </div>
          <button
            className="normal-button bg-main-Black text-main-Green01 cursor-pointer"
            onClick={handlePostToTwitter}>
            Post
          </button>
        </div>
        <div className="flex justify-between mt-9">
          <div className="flex items-center gap-4">
            {statusNumber >= 3 ? (
              <div className="w-6 h-6 bg-main-Green01 rounded-full flex items-center justify-center">
                <CheckBig className="text-main-Black text-[1.125rem]" />
              </div>
            ) : (
              <span
                style={{ borderWidth: '2px' }}
                className="w-6 h-6 rounded-full border-solid border-main-Black w-4 h-4"></span>
            )}
            <span className="font-bold text-[1.125rem]">Invite 1 friend to get access</span>
          </div>
          <CopyIcon
            className={`cursor-pointer transition-colors ${copied ? 'text-main-Green01' : 'text-green01-200'}`}
            onClick={handleCopy}
          />
        </div>
        <div className="mt-4 bg-green01-800 p-6 rounded-2xl">
          🧃Airdrop season’s coming. I’m in Commi @commidotfun early — whitelist now or regret
          later:...
        </div>
      </div>

      <div className="flex items-center justify-between py-1">
        <div className="flex gap-4 items-center">
          <span
            className={`w-4 h-4 rounded-full ${statusNumber >= 3 ? 'bg-main-Green04' : 'bg-green01-1000'}`}></span>
          <span className="text-2xl font-extrabold text-main-Black">Get Whitelist</span>
        </div>

        {statusNumber === 3 && (
          <CommiButton
            size="medium"
            theme="primaryLinear"
            color={customColors.main.Black}
            onClick={claim}
            weight="bold">
            Calim
          </CommiButton>
        )}
      </div>
    </div>
  )
}

export default Page
