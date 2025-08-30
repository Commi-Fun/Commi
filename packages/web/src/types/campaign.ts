export interface CampaignCreateRequest {
  description: string
  tokenAddress: string
  tokenName: string
  ticker?: string
  totalAmount: string
  marketCap?: string
  startTime: Date
  endTime: Date
  duration: number
  rewardRound: number
  tags: string[]
  socialLinks: ISocialLinks // JSON type to match Prisma schema
  creatorId?: number
  txHash?: string
}
export interface ISocialLinks {
  xCommunityLink: string
  xLink: string
}
export interface Campaign {
  id: number
  description: string
  tokenAddress: string
  tokenName: string
  ticker: string | null
  totalAmount: number
  remainingAmount: number
  marketCap: string | null
  startTime: Date
  endTime: Date
  tags: string[]
  socialLinks: ISocialLinks // JSON type from Prisma
  status: 'UPCOMING' | 'ONGOING' | 'ENDED' | 'CANCELED'
  creatorId: number
  txHash: string | null
  createdAt: Date
  updatedAt: Date
  rewardRound: number
  // Additional fields for UI
  participationCount?: number
  creator?: string
  claimed?: boolean
}
