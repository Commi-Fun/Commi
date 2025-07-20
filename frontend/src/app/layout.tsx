import './globals.css'
import DashboardLayout from '@/dashboard/DashboardLayout'
import React from 'react'
import { Web3Provider } from '@/components/Web3Provider'
import { NextAuthProvider } from '@/components/NextAuthProvider'
import { SolanaProvider } from '@/components/SolanaProvider'
import '@solana/wallet-adapter-react-ui/styles.css'
import { GlobalWalletProvider } from '@/context/GlobalWalletProvider'

type MyComponentProps = React.PropsWithChildren<{
  title: string
}>

const Layout: React.FC<MyComponentProps> = ({ children }) => {
  return (
    <html>
      <body className={'font-sans'}>
        <Web3Provider>
          <SolanaProvider>
            <NextAuthProvider>
              <GlobalWalletProvider>
                <DashboardLayout>{children}</DashboardLayout>
              </GlobalWalletProvider>
            </NextAuthProvider>
          </SolanaProvider>
        </Web3Provider>
      </body>
    </html>
  )
}

export default Layout
