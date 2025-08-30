import { ISocialLinks } from './campaign'

export interface UserDTO {
  userId?: number
  twitterId: string
  name?: string
  handle?: string
  profileImageUrl?: string
}

export interface WhitelistDto {
  referralCode?: string
  registered?: boolean
  followed?: boolean
  posted?: boolean
  referred?: boolean
  claimed?: boolean
}

export interface LoginDto {
  accessToken: string
}

// Request DTOs - for API input validation
export interface CreateCampaignRequestDto {
  description: string
  tokenAddress: string
  tokenName: string
  totalAmount: number
  rewardRound: number
  duration: number // hours
  socialLinks: any
}

// Response DTOs - for API output
export interface CampaignResponseDto {
  id: string
  description: string
  tokenAddress: string
  tokenName: string
  ticker: string
  totalAmount: number
  remainingAmount: number
  marketCap: number
  startTime: Date
  endTime: Date
  status: string
  participationCount: number
  creator?: UserDTO
  tags: string[]
  nextRound: Date
  socialLinks: ISocialLinks
  claimed: boolean
  claimableAmount: number
  leaderboard?: LeaderboardDto[]
  joined: boolean
}

export interface LeaderboardDto {
  twitterId: string
  twitterHandle: string
  rank: number
  score: number
  airdropAmount: number
  percentage: number
}
