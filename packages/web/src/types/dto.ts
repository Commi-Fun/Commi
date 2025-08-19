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
  totalAmount: bigint
  duration: number // hours
  socialLinks: any
}

// Response DTOs - for API output
export interface CampaignResponseDto {
  id: number
  description: string
  tokenAddress: string
  tokenName: string
  ticker: string
  totalAmount: bigint
  remainingAmount: bigint
  marketCap: bigint
  startTime: Date
  endTime: Date
  status: string
  participationCount: number
  creator: string
  tags: string[]
  claimed: boolean
}
