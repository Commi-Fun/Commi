export interface UserDTO {
    userId?: number;
    twitterId: string;
    name?: string;
    handle?: string;
    profileImageUrl?: string;
}

export interface WhitelistDto {
    referralCode?: string;
    status?: string
}

export interface LoginDto {
    accessToken: string;
}