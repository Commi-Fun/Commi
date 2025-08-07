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