'use client'
import CopyIcon from '@/components/icons/CopyIcon'
import { REFERRAL_CODE_SEARCH_PARAM } from '@/lib/constants'
import { Popover } from '@mui/material'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'

const Page = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [invitedFriends, setInvitedFriends] = React.useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const { data } = useSession()

  const copyText = `🧃Airdrop season's coming. I'm in Commi @commidotfun early — whitelist now or regret later: https://commi.fun?${REFERRAL_CODE_SEARCH_PARAM}=${data?.user.referralCode}`

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (invitedFriends.length === 0) {
      return
    }
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

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
    const getReferees = () => {
      fetch('/api/whitelist/referees')
        .then(value => value.json())
        .then(value => {
          setInvitedFriends(value.data)
        })
        .catch(error => {
          console.error('Failed to check:', error)
        })
    }
    getReferees()
    setInterval(() => {
      getReferees()
    }, 3000)
  }, [])

  const open = Boolean(anchorEl)
  return (
    <div className="">
      <p className="text-[40px] lg:text-[54px] 2xl:text-[72px] text-main-Black font-extrabold mobile-font-shdow-white lg:font-shadow-white">
        BOOST YOUR
      </p>
      <p className="text-[#fbff00] text-[30px] lg:text-[54px] 2xl:text-[72px] font-extrabold mobile-font-shdow-black lg:font-shadow-black">
        AIRDROP REWARDS
      </p>

      <div className="border-black border-2 border-solid rounded-[18px] lg:rounded-4xl p-[18px] lg:py-6 lg:px-10 bg-white shadow-[6px_6px_0_#000000] text-[14px] lg:text-2xl font-bold lg:font-extrabold mt-10">
        <p>Invite friends and earn 20% of their Beta points </p>
        <p>— the more you invite, the bigger your future airdrop.</p>
      </div>

      <div className="flex justify-between items-center mt-12 lg:mt-20">
        <span className="font-medium lg:font-bold text-main-Black text-[1rem] lg:text-[1.125rem]">
          Copy Invite Link
        </span>
        <CopyIcon
          className={`text-[22px] lg:text-[24px] cursor-pointer transition-colors ${copied ? 'text-main-Green01' : 'text-green01-200'}`}
          onClick={handleCopy}
        />
      </div>
      <div className="mt-4 bg-green01-800 font-medium lg:font-[400] p-[18px] lg:p-6 rounded-2xl text-[14px] lg:text-[1.125rem]">
        🧃Airdrop season’s coming. I’m in Commi @commidotfun early — whitelist now or regret
        later:...
      </div>

      <p
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className="text-right mt-4 font-semibold text-[14px] lg:text-[1rem]">
        {invitedFriends.length} friends joined🧃
      </p>
      <Popover
        id="mouse-over-popover"
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={handlePopoverClose}
        sx={{ pointerEvents: 'none' }}
        disableRestoreFocus
        disableEnforceFocus>
        <div
          className="bg-blue-500 p-9"
          onMouseEnter={() => setAnchorEl(anchorEl)} // 保持弹框打开
          onMouseLeave={handlePopoverClose} // 鼠标离开时关闭
        >
          <div className="min-w-50 flex flex-col">
            <div className="text-main-White font-bold text-[1.125rem]">
              {invitedFriends.length} friends joined🧃
            </div>
            <div className="flex flex-col gap-4 mt-6">
              {invitedFriends.map((item, index) => (
                <div className="flex gap-2" key={index}>
                  <img
                    className="rounded-full"
                    width={24}
                    height={24}
                    src={item.profileImageUrl}
                    alt=""
                  />
                  <span className="text-[1.125rem] font-bold text-blue-200">@{item.handle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Popover>
    </div>
  )
}

export default Page
