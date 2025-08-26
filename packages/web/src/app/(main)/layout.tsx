import DashboardLayout from '@/dashboard/DashboardLayout'
import React from 'react'
import { Web3Provider } from '@/components/Web3Provider'
import { SolanaProvider } from '@/components/SolanaProvider'
import { QueryProvider } from '@/components/QueryProvider'
import '@solana/wallet-adapter-react-ui/styles.css'
import { GlobalContextProvider } from '@/context/GlobalContext'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Web3Provider>
      <SolanaProvider>
        <GlobalContextProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </GlobalContextProvider>
      </SolanaProvider>
    </Web3Provider>
  )
}

export default Layout
