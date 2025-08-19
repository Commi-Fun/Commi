import '../globals.css'
import DashboardLayout from '@/dashboard/DashboardLayout'
import React from 'react'
import { Web3Provider } from '@/components/Web3Provider'
import { NextAuthProvider } from '@/components/NextAuthProvider'
import { SolanaProvider } from '@/components/SolanaProvider'
import '@solana/wallet-adapter-react-ui/styles.css'
import '../globals.css'
import { Nunito } from 'next/font/google'
import { GlobalContextProvider } from '@/context/GlobalContext'
import { Metadata } from 'next'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito', // CSS 变量名
})

type MyComponentProps = React.PropsWithChildren<{
  title: string
}>

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://commi.fun'),
  title: 'Commi - Join the Airdrop Early!',
  description:
    "🧃Airdrop season's coming. Join Commi early and get whitelisted now or regret later!",
  icons: {
    icon: '/logo.svg', // 临时使用现有的 logo.svg
    shortcut: '/logo.svg',
    apple: '/inviteLogo.png', // 使用现有的 inviteLogo.png
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commi - Join the Airdrop Early!',
    description:
      "🧃Airdrop season's coming. Join Commi early and get whitelisted now or regret later!",
    images: ['/images/twitterDisplay.png'], // 需要在 public 文件夹中添加这个图片
    creator: '@commidotfun',
    site: '@commidotfun',
  },
}

const Layout: React.FC<MyComponentProps> = ({ children }) => {
  console.log('nunito.variable', nunito.variable)
  return (
    <html className={nunito.variable}>
      <body className={nunito.className}>
        <Web3Provider>
          <SolanaProvider>
            <NextAuthProvider>
              <GlobalContextProvider>
                <DashboardLayout>{children}</DashboardLayout>
              </GlobalContextProvider>
            </NextAuthProvider>
          </SolanaProvider>
        </Web3Provider>
      </body>
    </html>
  )
}

export default Layout
