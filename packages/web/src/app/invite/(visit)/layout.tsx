'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { TelegramIcon } from '@/components/icons/TelegramIcon'
import { XIcon } from '@/components/icons/XIcon'

type MemeType = {
  headSrc: string
  headSize: number
  className: string
  themeColor: string
  secondaryColor: string
  fullImageSrc: string
  width: number
  height: number
  isSpecial?: boolean
}

const memes: MemeType[] = [
  {
    headSrc: '/images/memeHeads/yellowDog.png',
    headSize: 240,
    className: 'absolute top-5 right-5',
    themeColor: '#FFAC2F',
    secondaryColor: '#FBF1A6',
    fullImageSrc: '/images/memeFullSize/yellowDog.png',
    width: 540,
    height: 800,
  },
  {
    headSrc: '/images/memeHeads/penguin.png',
    headSize: 124,
    className: 'absolute bottom-18.75 right-194.5',
    themeColor: '#2F93FF',
    secondaryColor: '#A6D5FB',
    fullImageSrc: '/images/memeFullSize/penguin.png',
    height: 773,
    width: 640,
  },
  {
    headSrc: '/images/memeHeads/frog.png',
    headSize: 120,
    className: 'absolute bottom-160 right-100',
    themeColor: '#36AB2B',
    secondaryColor: '#A6FBB8',
    fullImageSrc: '/images/memeFullSize/frog.png',
    height: 736,
    width: 571,
  },
  {
    headSrc: '/images/memeHeads/man.png',
    headSize: 100,
    className: 'absolute bottom-200 right-120',
    themeColor: '#2f93ff',
    secondaryColor: '#A6D5FB',
    fullImageSrc: '/images/memeFullSize/man.png',
    height: 1038,
    width: 705,
  },
  {
    headSrc: '/images/memeHeads/cat.png',
    headSize: 120,
    className: 'absolute bottom-128.5 right-8.5',
    themeColor: '#ffac2f',
    secondaryColor: '#fbf1a6',
    fullImageSrc: '/images/memeFullSize/cat.png',
    height: 694,
    width: 544,
  },
  {
    headSrc: '/images/memeHeads/kitty.png',
    headSize: 160,
    className: 'absolute bottom-170 right-160',
    themeColor: '#ffac2f',
    secondaryColor: '#fbf1a6',
    fullImageSrc: '/images/memeFullSize/kitty.png',
    height: 731,
    width: 569,
  },
  {
    headSrc: '/images/memeHeads/dog.png',
    headSize: 140,
    className: 'absolute bottom-100 right-150',
    themeColor: '#ff5e20',
    secondaryColor: '#fbf1a6',
    fullImageSrc: '/images/memeFullSize/dog.png',
    height: 593,
    width: 636,
    isSpecial: true,
  },
]

export default function InviteLayout({ children }: { children: React.ReactNode }) {
  const [hoveredMeme, setHoveredMeme] = useState<null | MemeType>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1)

  const handleXIconClick = () => {
    window.open('https://x.com/commidotfun', '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className={'w-screen h-screen transition-colors duration-300 bg-green01-500 overflow-hidden'}
      style={{ backgroundColor: hoveredMeme ? hoveredMeme.themeColor : undefined }}>
      <div className="pt-2.5 pl-4.5 lg:pt-10 lg:pl-20 ">
        <div className="flex  relative gap-3 w-29 lg:w-79 h-fit aspect-[2.67/1] overflow-hidden">
          <Image
            src={'/inviteLogo.png'}
            fill
            alt="Commi Logo"
            className="object-contain"
            sizes="(max-width: 1024px) 117.45px, 317.37px"
          />
        </div>
      </div>

      <div className="hidden lg:block absolute inset-0 z-50 pointer-events-none">
        {memes.map((meme, index) => (
          <Image
            key={index}
            className={`${index === hoveredIndex ? '' : 'blur-sm'} ${meme.className} cursor-pointer pointer-events-auto`}
            src={meme.headSrc}
            style={{ maxHeight: '80%' }}
            width={meme.headSize}
            height={meme.headSize}
            alt=""
            onMouseEnter={() => {
              setHoveredMeme(meme)
              setHoveredIndex(index)
            }}
            onMouseLeave={() => setHoveredMeme(null)}
          />
        ))}
      </div>

      {hoveredMeme?.isSpecial ? (
        <Image
          src={hoveredMeme.fullImageSrc}
          alt=""
          width={hoveredMeme?.width}
          height={hoveredMeme?.height}
          className="absolute -bottom-0 right-20 pointer-events-none"
        />
      ) : (
        <div className="absolute -bottom-[11.4vw] -right-[6.6vw] w-[50vw] h-[50vw] z-10">
          <div
            style={{ transform: 'translateX(-50%)' }}
            className={`absolute max-h-[60%] bottom-[11.4vw] left-[50%] pointer-events-none`}>
            <Image
              src={hoveredMeme ? hoveredMeme.fullImageSrc : '/images/commiCup.png'}
              alt=""
              width={hoveredMeme?.width || 400}
              height={hoveredMeme?.height || 680}
              className="max-h-[60%] w-auto object-contain"
            />
          </div>
          <div
            className={`w-full h-full bg-green01-900 rounded-full`}
            style={{
              backgroundColor: hoveredMeme ? hoveredMeme.secondaryColor : undefined,
            }}></div>
        </div>
      )}

      <div className="relative z-40">{children}</div>
      <footer className="fixed flex gap-6 bottom-10 left-20">
        <TelegramIcon fontSize={'2.5rem'} className="cursor-pointer" />
        <XIcon fontSize={'2.5rem'} className="cursor-pointer" onClick={handleXIconClick} />
      </footer>
    </div>
  )
}
