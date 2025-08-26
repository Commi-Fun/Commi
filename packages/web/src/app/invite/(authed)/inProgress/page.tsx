'use client'
import CommiButton from '@/components/CommiButton'
import CheckBig from '@/components/icons/CheckBig'
import CopyIcon from '@/components/icons/CopyIcon'
import RedoIcon from '@/components/icons/RedoIcon'
import { SpinningRefresh } from '@/components/SpinningRefresh'
import { copyText, url_prefix } from '@/lib/constants'
import { customColors } from '@/shared-theme/themePrimitives'
import { WhitelistStatus } from '@/types/whitelist'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'

const Page = () => {
  const [copied, setCopied] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const router = useRouter()
  const { data } = useSession()
  const [postUrl, setPostUrl] = useState('')
  const referalUrl = `${url_prefix}/invite/${data?.user.referralCode}`
  const [whitelistStatus, setWhitelistStatus] = useState<WhitelistStatus>({})
  const [posted, setPosted] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyError, setVerifyError] = useState(false)
  const verifyButtonDisabled = !postUrl || verifyLoading

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText + referalUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1000) // 2秒后重置状态
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  console.log('data?.user.status', data?.user.status)

  useEffect(() => {
    if (whitelistStatus?.claimed) {
      router.push('/invite/finish')
    }
  }, [router, whitelistStatus?.claimed])

  useEffect(() => {
    const fetchStatus = () =>
      fetch('/api/whitelist/check')
        .then(value => value.json())
        .then(response => {
          setWhitelistStatus(response.data)
        })
        .catch(error => {
          if (error instanceof Error) console.error('Failed to check:', error.message)
        })

    fetchStatus()
  }, [])

  const handleCheck = async () => {
    if (isSpinning) return // 防止重复点击
    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 1000)
    try {
      const result = await fetch('/api/whitelist/check')
      const data = await result.json()
      if (data.status === 200) {
        setWhitelistStatus(prev => ({
          ...prev,
          ...data.data,
        }))
      }
    } catch (err) {
      console.error('Failed to check:', err)
    }
  }

  const claim = async () => {
    const result = await fetch('/api/whitelist/claim', {
      method: 'POST',
    })
    const data = await result.json()
    if (data.status === 200) {
      setWhitelistStatus(prev => ({
        ...prev,
        claimed: true,
      }))
      router.push('/invite/finish')
    }
  }

  const handlePostToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(copyText)}&url=${encodeURIComponent(referalUrl)}`

    window.open(twitterUrl, '_blank')
    setPosted(true)
  }

  const followOnX = () => {
    const twitterUrl = `https://x.com/commidotfun`

    window.open(twitterUrl, '_blank')

    fetch('/api/whitelist/follow', {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        setWhitelistStatus(prev => ({
          ...prev,
          followed: !!!data?.data?.followed,
        }))
      })
  }

  const handleVerify = () => {
    setVerifyLoading(true)
    fetch('/api/whitelist/post', {
      method: 'POST',
      body: JSON.stringify({
        postLink: postUrl,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 200) {
          setWhitelistStatus(prev => ({
            ...prev,
            posted: !!data?.data?.posted,
          }))
        } else {
          setVerifyError(true)
        }
      })
      .catch(err => {
        setVerifyError(true)
        if (err instanceof Error) console.error('Failed to check:', err.message)
      })
      .finally(() => {
        setVerifyLoading(false)
      })
  }

  const canClaim = whitelistStatus.followed && whitelistStatus.posted && whitelistStatus.referred

  return (
    <div className="">
      <p className="text-[40px] lg:text-[46px] 2xl:text-[72px] text-main-Black font-extrabold mobile-font-shdow-white lg:font-shadow-white">
        3 STEPS
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

      <div className="h-fit py-[50px] 2xl:py-[70px] relative pl-11">
        <div
          className={`absolute left-0.5 lg:left-1.5 top-0 bottom-0 w-1 ${canClaim ? 'bg-main-Green04' : 'bg-green01-900'} rounded-full`}></div>
        {/* follow on X */}
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            {whitelistStatus.followed ? (
              <div className="w-4.5 h-4.5 lg:w-6 lg:h-6 bg-main-Green01 rounded-full flex items-center justify-center">
                <CheckBig className="text-main-Black text-[14px] lg:text-[1.125rem]" />
              </div>
            ) : (
              <span
                style={{ borderWidth: '2px' }}
                className="w-4.5 h-4.5 lg:w-6 lg:h-6 rounded-full border-solid border-main-Black"></span>
            )}
            <span className="font-bold lg:text-[1.125rem] cursor-pointer">
              Follow us on X (Twitter)
            </span>
          </div>
          {!whitelistStatus.followed && (
            <button
              className="normal-button w-20 h-8 lg:w-30 lg:h-10 text-[12px] lg:text-[1rem] bg-main-Black text-main-Green01 cursor-pointer"
              onClick={followOnX}>
              Follow
            </button>
          )}
        </div>
        {/* Post */}
        <div className="flex justify-between mt-9">
          <div className="flex items-center gap-4">
            {whitelistStatus.posted ? (
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
          {!whitelistStatus.posted &&
            (posted ? (
              <button
                className={`disabled flex gap-2 normal-button w-20 h-8 lg:w-30 lg:h-10 text-[12px] lg:text-[1rem] 
                  bg-main-Black ${verifyButtonDisabled ? 'text-green01-400 !bg-green01-200' : 'text-main-Green01'}  cursor-pointer`}
                onClick={handleVerify}
                disabled={verifyButtonDisabled}>
                {verifyLoading ? (
                  <>
                    <SpinningRefresh /> Verifing...
                  </>
                ) : verifyError ? (
                  'Retry'
                ) : (
                  'Verify'
                )}
              </button>
            ) : (
              <button
                className="normal-button w-20 h-8 lg:w-30 lg:h-10 text-[12px] lg:text-[1rem] bg-main-Black text-main-Green01 cursor-pointer"
                onClick={handlePostToTwitter}>
                Post
              </button>
            ))}
        </div>
        {!whitelistStatus.posted && posted && (
          <div className="mt-4 flex flex-col items-end">
            <input
              className={`outline-0 lg:text-[18px] bg-green01-800 focus:bg-green01-1000 
                  p-6 rounded-2xl w-full border-0 ${verifyError ? 'border-[1px] !border-red-300' : ''} focus:border-1 focus:border-main-Green02`}
              placeholder="Please paste the URL of your posted tweet."
              onChange={e => setPostUrl(e.target.value)}
            />
            {verifyError && (
              <p className="text-red-500 mt-2 font-extrabold">
                ⚠️ Verification failed！ Make sure your tweet is public and the URL is correct.
              </p>
            )}
          </div>
        )}

        {/* invite */}
        <div className="flex justify-between mt-9">
          <div className="flex items-center gap-4">
            {whitelistStatus.referred ? (
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
            className={`w-2 lg:w-4 h-2 lg:h-4 rounded-full ${canClaim ? 'bg-main-Green04' : 'bg-green01-1000'}`}></span>
          <span className="text-[18px] lg:text-2xl font-bold lg:font-extrabold text-main-Black">
            Get Whitelist
          </span>
        </div>

        {canClaim && (
          <>
            <div
              className="hidden lg:block gradient-border-wrapper rounded-full cursor-pointer"
              onClick={claim}>
              <div className="gradient-border-content relative rounded-full px-[75px] py-[7.5px]">
                <Image
                  className="hidden lg:block absolute bottom-0 left-9"
                  src="/logo.svg"
                  alt=""
                  width={35}
                  height={60}
                />
                <span className="font-bold text-[18px]">Claim</span>
              </div>
            </div>
            <div className="block lg:hidden ">
              <CommiButton
                size="medium"
                color={customColors.main.Black}
                onClick={claim}
                className="gradient-border-custom">
                <span className="px-15 font-bold text-[18px]">Claim</span>
              </CommiButton>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Page
