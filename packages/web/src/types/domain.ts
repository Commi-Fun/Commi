export interface UserDomain {
    userId?: number;
    twitterId?: number;
    name?: string;
    username?: string;
    profileImageUrl?: string;
}

export interface WhitelistDomain {
    user: UserDomain;
    referralCode?: string;
    status: string;
}

export interface ReferralDomain {
    referrerId: number;
    referrerTwitterId: number;
    refereeId: number;
    refereeTwitterId: number;
}