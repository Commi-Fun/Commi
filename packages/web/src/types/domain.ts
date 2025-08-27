import { ISocialLinks } from './campaign'

export interface UserDomain {
  userId?: number
  twitterId?: string
  name?: string
  handle?: string
  profileImageUrl?: string
}

export interface WhitelistDomain {
  user: UserDomain
  referralCode?: string
  status: string
}

export interface ReferralDomain {
  referrerId: number
  referrerTwitterId: string
  refereeId: number
  refereeTwitterId: string
}

export interface CampaignDomain {
  id?: number
  description: string
  tokenAddress: string
  tokenName: string
  ticker?: string
  totalAmount: number
  remainingAmount: number
  marketCap: number
  startTime: Date
  endTime: Date
  tags?: string[]
  socialLinks: ISocialLinks
  rewardRound: number
  status: string
  creatorId: number
  txHash?: string
}
