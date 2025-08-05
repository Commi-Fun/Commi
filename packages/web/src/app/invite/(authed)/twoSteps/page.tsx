'use client'
import CommiButton from '@/components/CommiButton'
import CheckBig from '@/components/icons/CheckBig'
import CopyIcon from '@/components/icons/CopyIcon'
import RedoIcon from '@/components/icons/RedoIcon'
import { copyText, REFERRAL_CODE_SEARCH_PARAM } from '@/lib/constants'
import { WhitelistStatus } from '@/lib/services/whitelistService'
import { customColors } from '@/shared-theme/themePrimitives'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

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
  const { data, update } = useSession()
  console.log('data.user', data?.user)

  const [status, setStatus] = useState<'REGISTERED' | 'CLAIMED'>('REGISTERED')
  const statusNumber = STATUS_MAP[status] || 0
  const referalUrl = `https://commi.fun?${REFERRAL_CODE_SEARCH_PARAM}=${data?.user.referralCode}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText + referalUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000) // 2秒后重置状态
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const updateStatus = useCallback(
    (response: any) => {
      if (data?.user.status !== response.data.status) {
        update({
          user: {
            ...data?.user,
            status: response.data.status,
          },
        })
      }
      setStatus(response.data.status)
    },
    [data?.user, update],
  )

  console.log('data?.user.status', data?.user.status)

  useEffect(() => {
    if (data?.user.status === WhitelistStatus.CLAIMED) {
      router.push('/invite/finish')
    }
  }, [data?.user.status, router])

  useEffect(() => {
    const fetchStatus = () =>
      fetch('/api/whitelist/check')
        .then(value => value.json())
        .then(value => {
          updateStatus(value)
        })
        .catch(error => {
          console.error('Failed to check:', error)
        })
    fetchStatus()
    setInterval(() => {
      fetchStatus()
    }, 3000)
  }, [status, update, updateStatus])

  const handleCheck = async () => {
    if (isSpinning) return // 防止重复点击
    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 1000)
    try {
      const result = await fetch('/api/whitelist/check')
      const data = await result.json()
      setStatus(data.data.status)
    } catch (err) {
      console.error('Failed to check:', err)
    }
  }

  const claim = async () => {
    const result = await fetch('/api/whitelist/claim', {
      method: 'POST',
    })
    const data = await result.json()
    updateStatus(data)
    router.push('/invite/finish')
  }

  const handlePostToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(copyText)}&url=${encodeURIComponent(referalUrl)}`

    window.open(twitterUrl, '_blank')

    fetch('/api/whitelist/post', {
      method: 'POST',
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        updateStatus(data)
      })
      .catch(err => {
        console.error('Failed to post:', err)
      })
  }

  return (
    <div className="">
      <p className="text-[40px] lg:text-[46px] 2xl:text-[72px] text-main-Black font-extrabold mobile-font-shdow-white lg:font-shadow-white">
        2 STEPS
      </p>
      <p className="text-white font-extrabold mobile-font-shdow-white lg:font-shadow-black text-[30px] lg:text-[46px] 2xl:text-[72px] stroke-black mt-1.5">
        GET WHITELIST EARLY!
      </p>
      <div className="flex items-center justify-between w-full mt-15 2xl:mt-30">
        <div className="flex items-center gap-4">
          <span className="w-2 lg:w-4 h-2 lg:h-4 rounded-full bg-main-Green04"></span>
          <span className="text-[18px] lg:text-2xl font-bold lg:font-extrabold text-main-Black">
            Complete Tasks
          </span>
        </div>
        <div className="flex items-center gap-0.5 lg:gap-2 cursor-pointer" onClick={handleCheck}>
          <RedoIcon
            color={customColors.green01[200]}
            className={`text-[18px] lg:text-[28px] ${isSpinning ? 'animate-spin' : ''}`}
          />
          <span className="text-green01-200 text-[14px] lg:text-[24px] font-bold">Check</span>
        </div>
      </div>

      <div className="h-[360px] py-[50px] 2xl:py-[70px] relative pl-11">
        <div
          className={`absolute left-0.5 lg:left-1.5 top-0 bottom-0 w-1 ${statusNumber >= 3 ? 'bg-main-Green04' : 'bg-green01-900'} rounded-full`}></div>
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            {statusNumber >= 2 ? (
              <div className="w-4.5 h-4.5 lg:w-6 lg:h-6 bg-main-Green01 rounded-full flex items-center justify-center">
                <CheckBig className="text-main-Black text-[14px] lg:text-[1.125rem]" />
              </div>
            ) : (
              <span
                style={{ borderWidth: '2px' }}
                className="w-4.5 h-4.5 lg:w-6 lg:h-6 rounded-full border-solid border-main-Black"></span>
            )}
            <span className="font-bold lg:text-[1.125rem] cursor-pointer">Post to Join</span>
          </div>
          {statusNumber < 2 && (
            <button
              className="normal-button w-20 h-8 lg:w-30 lg:h-10 text-[12px] lg:text-[1rem] bg-main-Black text-main-Green01 cursor-pointer"
              onClick={handlePostToTwitter}>
              Post
            </button>
          )}
        </div>
        <div className="flex justify-between mt-9">
          <div className="flex items-center gap-4">
            {statusNumber >= 3 ? (
              <div className="w-4.5 h-4.5 lg:w-6 lg:h-6 bg-main-Green01 rounded-full flex items-center justify-center">
                <CheckBig className="text-main-Black text-[14px] lg:text-[1.125rem]" />
              </div>
            ) : (
              <span
                style={{ borderWidth: '2px' }}
                className="w-4.5 h-4.5 lg:w-6 lg:h-6 rounded-full border-solid border-main-Black"></span>
            )}
            <span className="font-bold lg:text-[1.125rem]">Invite 1 friend to get access</span>
          </div>
          <CopyIcon
            className={`cursor-pointer transition-colors text-[22px] lg:text-[24px] ${copied ? 'text-main-Green01' : 'text-green01-200'}`}
            onClick={handleCopy}
          />
        </div>
        <div className="mt-4 bg-green01-800 p-6 rounded-2xl">{copyText + referalUrl}</div>
      </div>

      <div className="flex items-center justify-between py-1">
        <div className="flex gap-4 items-center">
          <span
            className={`w-2 lg:w-4 h-2 lg:h-4 rounded-full ${statusNumber >= 3 ? 'bg-main-Green04' : 'bg-green01-1000'}`}></span>
          <span className="text-[18px] lg:text-2xl font-bold lg:font-extrabold text-main-Black">
            Get Whitelist
          </span>
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
