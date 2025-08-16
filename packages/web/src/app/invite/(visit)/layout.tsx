/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { TelegramIcon } from '@/components/icons/TelegramIcon'
import { XIcon } from '@/components/icons/XIcon'
import { ChatDots } from '@/components/icons/ChatDots'
import { usePlatform } from '@/hooks/usePlatform'
import { JumpOutside } from '../components/jumpOutside'

type MemeType = {
  headSrc: string
  headSize: number
  className: string
  themeColor: string
  secondaryColor: string
  fullImageSrc: string
  isSpecial?: boolean
  fullImageClassName: string
}

const memes: MemeType[] = [
  {
    headSrc: '/images/memeHeads/yellowDog.png',
    headSize: 240,
    className:
      'absolute bottom-192 right-53.5 2xl:bottom-205 2xl:right-34 w-30 2xl:w-50 h-30 2xl:h-50',
    themeColor: '#FFAC2F',
    secondaryColor: '#FBF1A6',
    fullImageSrc: '/images/memeFullSize/yellowDog.png',
    fullImageClassName: 'w-[500] h-[500] 2xl:w-[700] 2xl:h-[700] right-[0] 2xl:right-[0]',
  },
  {
    headSrc: '/images/memeHeads/penguin.png',
    headSize: 124,
    className: 'absolute bottom-59 2xl:bottom-[87px] right-167.5 2xl:right-[790px] w-30 h-30',
    themeColor: '#2F93FF',
    secondaryColor: '#A6D5FB',
    fullImageSrc: '/images/memeFullSize/penguin.png',
    fullImageClassName: 'w-[465] h-[506] 2xl:w-[640] 2xl:h-[652] right-[31px] 2xl:right-[41px]',
  },
  {
    headSrc: '/images/memeHeads/frog.png',
    headSize: 120,
    className:
      'absolute w-20 h-20 bottom-[564px] 2xl:bottom-[700px] right-[380px] 2xl:right-[500px]',
    themeColor: '#36AB2B',
    secondaryColor: '#A6FBB8',
    fullImageSrc: '/images/memeFullSize/frog.png',
    fullImageClassName:
      'w-[430.15] h-[490] 2xl:w-[571] 2xl:h-[673] right-[34.85px] 2xl:right-[69px]',
  },
  {
    headSrc: '/images/memeHeads/man.png',
    headSize: 100,
    className:
      'absolute w-20 2xl:w-25 h-20 2xl:h-25 bottom-121 2xl:bottom-220 right-4 2xl:right-120',
    themeColor: '#2f93ff',
    secondaryColor: '#A6D5FB',
    fullImageSrc: '/images/memeFullSize/man.png',
    fullImageClassName: 'w-[520.5] h-[514] 2xl:w-[705] 2xl:h-[711] -right-[10px] 2xl:-right-[15px]',
  },
  {
    headSrc: '/images/memeHeads/cat.png',
    headSize: 120,
    className:
      'absolute w-20 2xl:w-25 h-20 2xl:h-25 bottom-[650px] right-[44px] 2xl:bottom-[692px] 2xl:right-[34px]',
    themeColor: '#ffac2f',
    secondaryColor: '#fbf1a6',
    fullImageSrc: '/images/memeFullSize/cat.png',
    fullImageClassName:
      'w-[440] h-[490] 2xl:w-[544px] 2xl:h-[614px] right-[28.59] 2xl:right-[106px]',
  },
  {
    headSrc: '/images/memeHeads/kitty.png',
    headSize: 160,
    className:
      'absolute w-30 2xl:w-40 h-30 2xl:h-40 bottom-180 2xl:bottom-158 right-114 2xl:right-160',
    themeColor: '#ffac2f',
    secondaryColor: '#fbf1a6',
    fullImageSrc: '/images/memeFullSize/kitty.png',
    fullImageClassName: 'w-[400] h-[480] 2xl:w-[569px] 2xl:h-[665px] right-[34px] 2xl:right-[51px]',
  },
  {
    headSrc: '/images/memeHeads/dog.png',
    headSize: 140,
    className:
      'absolute w-25 h-25 bottom-[380px] right-[496px] 2xl:bottom-[328px] 2xl:right-[900px]',
    themeColor: '#ff5e20',
    secondaryColor: '#fbf1a6',
    fullImageSrc: '/images/memeFullSize/dog.png',
    fullImageClassName: 'w-[900] h-[720] 2xl:w-[1130px] 2xl:h-[904px] -right-50 2xl:-right-[159px]',
    isSpecial: true,
  },
  {
    headSrc: '/images/memeHeads/girl.png',
    headSize: 140,
    className:
      'absolute w-20 h-20 2xl:w-30 2xl:h-30 bottom-[120px] right-[510px] 2xl:bottom-[350px] 2xl:right-[650px]',
    themeColor: '#ff2fcb',
    secondaryColor: '#ffc01d',
    fullImageSrc: '/images/memeFullSize/girl.png',
    fullImageClassName:
      'w-[459.34] h-[490px] 2xl:w-[637px] 2xl:h-[678px] right-[20.66px] 2xl:right-[41px]',
  },
]

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  const [hoveredMeme, setHoveredMeme] = useState<null | MemeType>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1)
  const [clickSelected, setClickSelected] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const isSocialMobile = usePlatform()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 500)
    }

    // 防抖函数
    const debounce = (func: () => void, delay: number) => {
      let timeoutId: NodeJS.Timeout
      return () => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(func, delay)
      }
    }

    const debouncedCheckMobile = debounce(checkMobile, 150)

    checkMobile()
    window.addEventListener('resize', debouncedCheckMobile)

    return () => window.removeEventListener('resize', debouncedCheckMobile)
  }, [])

  const handleRelevantLinkClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (isSocialMobile) {
    return <JumpOutside />
  }

  return (
    <div
      className={
        'w-screen min-h-svh flex flex-col transition-colors duration-500 bg-green01-500 overflow-hidden'
      }
      style={{ backgroundColor: hoveredMeme ? hoveredMeme.themeColor : undefined }}>
      <div className="hidden lg:block absolute inset-0 z-50 pointer-events-none">
        {memes.map((meme, index) => (
          <img
            key={index}
            className={`${index === hoveredIndex ? '' : 'blur-sm'} ${meme.className} cursor-pointer pointer-events-auto ${
              index === hoveredIndex || (clickSelected && index === hoveredIndex)
                ? ''
                : 'float-animation'
            }`}
            src={meme.headSrc}
            alt=""
            onMouseEnter={() => {
              setClickSelected(false)
              setHoveredMeme(meme)
              setHoveredIndex(index)
            }}
            onMouseLeave={() => {
              if (clickSelected) return
              setHoveredMeme(null)
              setHoveredIndex(-1)
            }}
            onClick={() => {
              setClickSelected(true)
              setHoveredMeme(meme)
              setHoveredIndex(index)
            }}
          />
        ))}
      </div>

      <main className="relative z-40 flex-grow px-4.5 lg:px-15 2xl:px-20">
        <div className="mt-2.5 lg:mt-10">
          <div className="flex relative gap-3 w-29 lg:w-79 h-fit aspect-[2.67/1] overflow-hidden">
            <Image
              src={'/inviteLogo.png'}
              fill
              alt="Commi Logo"
              className="object-contain"
              sizes="(max-width: 1024px) 117.45px, 317.37px"
            />
          </div>
        </div>
        <div className="flex relative lg:hidden w-full items-center justify-center mt-[46px]">
          <div
            className={`rounded-full bg-green01-900 w-[280px] h-[280px]`}
            style={{ backgroundColor: hoveredMeme?.secondaryColor || '' }}></div>
          <Image
            src={'/images/mobileLogoAndFont.png'}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            alt=""
            width={175}
            height={187.42}
          />
        </div>
        {children}
      </main>
      <footer className="flex justify-end lg:justify-start gap-4 lg:gap-6 px-4 lg:px-15 2xl:px-20 py-4 lg:py-10 mt-6">
        <TelegramIcon
          onClick={() => handleRelevantLinkClick('https://t.me/commigroup')}
          className={`cursor-pointer text-[1.5rem] lg:text-[2.5rem]`}
        />
        <XIcon
          className={`cursor-pointer text-[1.5rem] lg:text-[2.5rem]`}
          onClick={() => handleRelevantLinkClick('https://x.com/commidotfun')}
        />
        <div
          className="bg-main-Black h-6 lg:h-10 px-2.5 lg:px-4 flex items-center gap-2 text-main-White rounded-4xl cursor-pointer"
          onClick={() =>
            window.open(
              'https://docs.google.com/forms/d/1x6qMHY8DRFQroO5riwxJfexCxBGsmsN-bj0yTSyobXw/viewform?edit_requested=true',
            )
          }>
          <span className="text-[14px] lg:text-[22px] font-extrabold">contact us</span>
          <ChatDots className="text-[14px] lg:text-[1.5rem]"></ChatDots>
        </div>
      </footer>

      <div className="hidden lg:flex justify-end">
        {hoveredMeme?.isSpecial ? (
          <img
            src={hoveredMeme.fullImageSrc}
            className={`absolute bottom-0 ${hoveredMeme.fullImageClassName} fade-in-image`}
            alt=""
          />
        ) : (
          <div className="relative w-[600px] 2xl:w-[850px] h-[560px] 2xl:h-[769] -mt-[560px] 2xl:-mt-[769px] right-0 overflow-hidden">
            <div
              className={`rounded-full bg-green01-900 h-[700px] w-[700px] 2xl:h-[977px] 2xl:w-[977px] transition-all duration-300 ease-out`}
              style={{ backgroundColor: hoveredMeme?.secondaryColor || '' }}></div>
            {hoveredMeme ? (
              <img
                key={hoveredMeme.fullImageSrc}
                src={hoveredMeme.fullImageSrc}
                className={`absolute bottom-0 w-[500] h-[500] 2xl:w-[700] 2xl:h-[700] right-[0] meme-container-enter`}
                alt=""
              />
            ) : (
              <>
                <Image
                  className="2xl:hidden absolute bottom-0 right-[102.71px] 2xl:right-[162px] fade-in-slow"
                  alt=""
                  width={293.79}
                  height={459.5}
                  src="/images/commiCup.png"
                />

                <Image
                  className="hidden 2xl:block absolute bottom-0 right-[102.71px] 2xl:right-[162px] fade-in-slow"
                  alt=""
                  width={400}
                  height={621}
                  src="/images/commiCup.png"
                />
              </>
            )}
          </div>
        )}
      </div>

      {!isMobile && (
        <div style={{ display: 'none' }}>
          {memes.map((meme, index) => {
            return <img key={index} className={''} src={meme.fullImageSrc} alt="" />
          })}
        </div>
      )}
    </div>
  )
}
