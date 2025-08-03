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