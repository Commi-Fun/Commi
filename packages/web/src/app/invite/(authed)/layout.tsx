'use client'
import AppTheme from '@/shared-theme/AppTheme'
import Image from 'next/image'
import '../../globals.css'
import '../invite.css'
import { useSession } from 'next-auth/react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data } = useSession()
  console.log('data', data)
  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-12 pt-10 px-20">
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
      <main>{children}</main>
    </>
  )
}

export default Layout
