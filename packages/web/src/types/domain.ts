export interface UserDomain {
    userId?: number;
    twitterId?: string;
    name?: string;
    handle?: string;
    profileImageUrl?: string;
}

export interface WhitelistDomain {
    user: UserDomain;
    referralCode?: string;
    status: string;
}

export interface ReferralDomain {
    referrerId: number;
    referrerTwitterId: string;
    refereeId: number;
    refereeTwitterId: string;
}

export interface CampaignDomain {
    id?: number;
    description: string;
    tokenAddress: string;
    tokenName: string;
    ticker?: string;
    totalAmount: bigint;
    remainingAmount: bigint;
    marketCap?: bigint;
    startTime: Date;
    endTime: Date;
    tags?: string[];
    socialLinks: any;
    status: string;
    creatorId: number;
    txHash?: string;
}