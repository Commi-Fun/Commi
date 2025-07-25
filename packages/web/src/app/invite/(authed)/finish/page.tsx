'use client'
import CopyIcon from '@/components/icons/CopyIcon'
import { Popover } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const Page = () => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [invitedFriends, setInvitedFriends] = React.useState<object[]>([{}, {}, {}, {}, {}])

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (invitedFriends.length === 0) {
      return
    }
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  return (
    <div className="w-225 absolute right-22.5">
      <p className="text-[72px] text-main-Black font-extrabold font-shadow-white">BOOST YOUR</p>
      <p className="text-[#fbff00] text-[72px] font-extrabold font-shadow-black">AIRDROP REWARDS</p>

      <div className="border-black border-2 border-solid rounded-4xl py-6 bg-white px-10 shadow-[6px_6px_0_#000000] text-2xl font-extrabold">
        <p>Invite friends and earn 20% of their Beta points </p>
        <p>— the more you invite, the bigger your future airdrop.</p>
      </div>

      <div className="flex justify-between items-center mt-20">
        <span className="font-bold text-main-Black text-[1.125rem]">Copy Invite Link</span>
        <CopyIcon className="text-green01-200 cursor-pointer" />
      </div>
      <div className="mt-4 bg-green01-800 p-6 rounded-2xl text-[1.125rem]">
        🧃Airdrop season’s coming. I’m in Commi @commidotfun early — whitelist now or regret
        later:...
      </div>

      <p
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className="text-right mt-4 font-semibold">
        X friends joined🧃
      </p>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
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
        disableRestoreFocus>
        <div className="bg-blue-500 p-9">
          <div className="min-w-50 flex flex-col">
            <div className="text-main-White font-bold text-[1.125rem]">X friends invited</div>
            <div className="flex flex-col gap-4 mt-6">
              {invitedFriends.slice(0, 4).map((_, index) => (
                <div className="flex gap-2" key={index}>
                  <Image className="rounded-full" width={24} height={24} src={''} alt="" />
                  <span className="text-[1.125rem] font-bold text-blue-200">Invite friends</span>
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
