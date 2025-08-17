export interface UserDTO {
    userId?: number;
    twitterId: string;
    name?: string;
    handle?: string;
    profileImageUrl?: string;
}

export interface WhitelistDto {
    referralCode?: string;
    registered?: boolean
    followed?: boolean
    posted?: boolean
    referred?: boolean
    claimed?: boolean
}

export interface LoginDto {
    accessToken: string;
}

export interface CampaignDto {
    id: number,
    name: string;
    description: string
    tokenAddress: string
    tokenName: string
    ticker: string
    totalAmount: bigint
    remainingAmount: bigint
    marketCap: bigint
    startTime: Date
    endTime: Date
    tags: string[]
    socialLinks: any
    creator?: string
    canClaim: boolean
    participationCount: number
    txHash: string
}