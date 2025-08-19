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

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-nunito', // CSS 变量名
})

type MyComponentProps = React.PropsWithChildren<{
  title: string
}>

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
