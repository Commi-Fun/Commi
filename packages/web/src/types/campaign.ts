export interface CampaignCreateRequest {
  name: string
  description: string
  tokenAddress: string
  tokenName: string
  ticker: string
  totalAmount: number
  txHash: string
  startTime: number
  endTime: number
  tags: string[]
  socialLinks: {
    twitter: string
    website: string
  }
}
export interface Campaign {
  id: number
  name: string
  description: string
  tokenAddress: string
  tokenName: string
  ticker: string
  totalAmount: number
  remainningAmount: number
  startTime: number
  endTime: number
  status: 'ONGOING' | 'ENDED'
  participationCount: number
  creator: string
  tags: string[]
  socialLinks: {
    twitter: string
    website: string
  }
  claimStatus: 'CAN_NOT_CLAIM' | 'CAN_CLAIM' | 'CLAIMED'
}
