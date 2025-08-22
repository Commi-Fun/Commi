'use client'
import { dummyCampaigns } from '@/lib/constants'
import { createContext, useState } from 'react'

export const GlobalContext = createContext<any>({})

export const GlobalContextProvider = ({ children }: any) => {
  const [campaigns, setCampaigns] = useState(dummyCampaigns)

  return (
    <GlobalContext.Provider
      value={{
        campaigns,
        setCampaigns,
      }}>
      {children}
    </GlobalContext.Provider>
  )
}
