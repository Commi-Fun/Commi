'use client'
import Image from 'next/image'
import '@/app/globals.css'
import '@/app/invite/invite.css'
import { useSession } from 'next-auth/react'
import { TelegramIcon } from '@/components/icons/TelegramIcon'
import { XIcon } from '@/components/icons/XIcon'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data } = useSession()

  const handleXIconClick = () => {
    window.open('https://x.com/commidotfun', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="bg-green01-500 h-screen w-screen">
      <div className="flex items-center justify-between gap-3 pt-10 px-20">
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
            <span className="text-[1.75rem] text-main-Black font-extrabold">{data.user.name}</span>
          </div>
        )}
      </div>

      <div className="absolute -bottom-[11.4vw] -left-[6.6vw] w-[50vw] h-[50vw] z-10">
        <div
          style={{ transform: 'translateX(-50%)' }}
          className={`absolute max-h-[60%] bottom-[11.4vw] left-[50%] pointer-events-none`}>
          <Image
            src={'/images/commiCup.png'}
            alt=""
            width={400}
            height={680}
            className="max-h-[60%] w-auto object-contain"
          />
        </div>
        <div className={`w-full h-full bg-green01-900 rounded-full`}></div>
      </div>

      <div className="relative z-40">{children}</div>
      <footer className="fixed flex gap-6 bottom-10 left-20">
        <TelegramIcon fontSize={'2.5rem'} className="cursor-pointer" />
        <XIcon fontSize={'2.5rem'} className="cursor-pointer" onClick={handleXIconClick} />
      </footer>
    </div>
  )
}

export default Layout
