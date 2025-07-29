'use client'
import Image from 'next/image'
import '@/app/globals.css'
import '@/app/invite/invite.css'
import { useSession } from 'next-auth/react'
import { TelegramIcon } from '@/components/icons/TelegramIcon'
import { XIcon } from '@/components/icons/XIcon'
import { ChatDots } from '@/components/icons/ChatDots'
import { LogOutButton } from '@/dashboard/components/LogOutButton'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data } = useSession()

  const handleXIconClick = () => {
    window.open('https://x.com/commidotfun', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-green01-500 w-screen min-h-screen relative overflow-hidden flex flex-col pt-10">
      <main className="w-full flex-grow overflow-y-auto">
        <div className="flex items-center justify-between gap-3 px-20">
          <Image
            src={'/inviteLogo.png'}
            width={317.67}
            height={119}
            alt="Commi Logo"
            quality={100}
            priority
            className="object-contain"
          />

          {data?.user && (
            <div className="flex items-center gap-4">
              <img
                className="rounded-full"
                src={data?.user?.image || ''}
                width={24}
                height={24}
                alt=""
              />
              <span className="text-main-Black font-bold">{data.user.name}</span>
              <LogOutButton className="text-[30px] cursor-pointer" />
            </div>
          )}
        </div>

        <div className="relative z-40 pr-15 2xl:pr-20 w-full flex justify-end">
          <div className=" w-[720px] 2xl:w-[900px]">{children}</div>
        </div>
      </main>

      <footer className="sticky flex gap-6 justify-end pr-15 2xl:pr-20 py-10 mt-6">
        <TelegramIcon fontSize={'2.5rem'} className="cursor-pointer" />
        <XIcon fontSize={'2.5rem'} className="cursor-pointer" onClick={handleXIconClick} />
        <div className="bg-main-Black h-10 px-4 flex items-center gap-2 text-main-White rounded-4xl cursor-pointer">
          <span className="text-[22px] font-extrabold">contact us</span>
          <ChatDots className="text-[1.5rem]"></ChatDots>
        </div>
      </footer>

      <div className="relative w-[600px] 2xl:w-[847px] h-[560px] 2xl:h-[790.5px] z-10 -mt-[560px] 2xl:-mt-[790.5px]">
        <Image
          src={'/images/rightCircleCup.png'}
          alt=""
          fill
          sizes="(max-width: 1536px) 600px, 847px"
          className="object-contain"
        />
      </div>
    </div>
  )
}

export default Layout
