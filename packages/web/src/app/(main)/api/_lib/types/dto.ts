export interface UserDTO {
    userId?: number;
    twitterId: string;
    name?: string;
    username?: string;
    profileImageUrl?: string;
}

export interface WhitelistDto {
    referralCode?: string;
    status?: string
}

export interface LoginDto {
    accessToken: string;
}