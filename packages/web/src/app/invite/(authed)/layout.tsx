'use client'
import Image from 'next/image'
import '@/app/globals.css'
import '@/app/invite/invite.css'
import { signOut, useSession } from 'next-auth/react'
import { TelegramIcon } from '@/components/icons/TelegramIcon'
import { XIcon } from '@/components/icons/XIcon'
import { ChatDots } from '@/components/icons/ChatDots'
import { LogOutButton } from '@/dashboard/components/LogOutButton'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ExitIcon } from '@/components/icons/ExitIcon'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data, status } = useSession()
  const router = useRouter()

  const handleXIconClick = () => {
    window.open('https://x.com/commidotfun', '_blank', 'noopener,noreferrer')
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [router, status])

  return (
    <div className="bg-green01-500 w-screen min-h-screen relative overflow-hidden flex flex-col pt-[18.5px] lx:pt-10">
      <main className="w-full flex-grow overflow-y-auto">
        <div className="flex items-center justify-between gap-3 px-[18px] lg:px-20">
          <Image
            src={'/inviteLogo.png'}
            width={317.67}
            height={119}
            alt="Commi Logo"
            quality={100}
            priority
            className="hidden lg:block object-contain"
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
              <LogOutButton className="hidden lg:block text-[24px] lg:text-[30px] cursor-pointer" />
              <ExitIcon
                className="block lg:hidden text-[24px] lg:text-[30px] cursor-pointer"
                onClick={() => signOut()}
              />
            </div>
          )}
        </div>

        <div className="px-[18px] lg:px-15  lg:relative z-40 2xl:pr-20 w-full flex justify-end mt-16 lg:mt-10">
          <div className="w-full lg:w-[720px] 2xl:w-[900px]">{children}</div>
        </div>
      </main>

      <footer className="flex justify-end gap-4 lg:gap-6 px-4 lg:px-15 2xl:px-20 py-4 lg:py-10 mt-6">
        <TelegramIcon className="cursor-pointer text-[1.5rem] lg:text-[2.5rem]" />
        <XIcon
          className="cursor-pointer text-[1.5rem] lg:text-[2.5rem]"
          onClick={handleXIconClick}
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

      <div className="hidden lg:block relative w-[600px] 2xl:w-[847px] h-[560px] 2xl:h-[790.5px] z-10 -mt-[560px] 2xl:-mt-[790.5px]">
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
