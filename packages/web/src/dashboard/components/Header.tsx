'use client'
import * as React from 'react'
import Stack from '@mui/material/Stack'
import Search from './Search'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import { customColors } from '@/shared-theme/themePrimitives'
import { useState } from 'react'
import LaunchPoolModal from '@/dashboard/components/LaunchPoolModal'
import AddPlus from '@/components/icons/AddPlusIcon'
import Image from 'next/image'
import CommiButton from '@/components/CommiButton'
import { ArrowCircleRight } from '@/components/icons/ArrowCircleRight'
import { CreateCampaignButton } from './CreateCampaignButton'

export default function Header() {
  const [open, setOpen] = useState(false)
  const onSubmit = (data: Record<string, string | number>) => {
    console.log('data', data)
    setOpen(false)
  }

  return (
    <div className="px-5 py-6 border-b-2 border-black flex justify-between">
      {/* <Stack direction={'row'} gap={2}>
        <RedButton>
          <span
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '10px',
              backgroundColor: '#d9d9d9',
              marginRight: '4px',
            }}></span>
          Beta Join
          <span
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '2px',
              backgroundColor: '#d9d9d9',
              marginLeft: '8px',
              marginRight: '4px',
            }}></span>
          {`{Campaign Name}`}
        </RedButton>
        <GreenButton>
          <span
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '10px',
              backgroundColor: '#d9d9d9',
              marginRight: '4px',
            }}></span>
          Zita Create{' '}
          <span
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '2px',
              backgroundColor: '#d9d9d9',
              marginLeft: '8px',
              marginRight: '4px',
            }}></span>
          {`{Campaign Name}`}
        </GreenButton>
      </Stack> */}
      {/* <Stack direction="row" sx={{ gap: 1 }}>
        <Button
          variant="contained"
          size={'small'}
          startIcon={<AddPlus />}
          sx={{
            borderRadius: '1.25rem',
            height: '46px',
            color: customColors.main.Black,
            fontWeight: 'bold',
            fontSize: '1.125rem',
            width: '179px',
          }}
          onClick={() => setOpen(true)}>
          Launch pool
        </Button>
        <Search />
      </Stack>
      <LaunchPoolModal onSubmit={onSubmit} open={open} setOpen={setOpen} /> */}

      <div className="flex gap-2 items-end">
        <Image src="/images/logoBlackSroke.svg" width={30} height={51} alt="logo"></Image>
        <div className="pb-[2px]">
          <Image src="/Commi.svg" width={76.8} height={17} alt="logo"></Image>
        </div>
        <div className="bg-lime-400 flex items-center justify-center px-2 rounded h-[25px]">
          <span className="text-[18px] font-extrabold text-main-Black">MVP</span>
        </div>
      </div>

      <div>
        <CreateCampaignButton />
      </div>
    </div>
  )
}
