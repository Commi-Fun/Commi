// Twitter/X data type definitions

export interface XCommunity {
  intro: XCommunityIntro;
  tweets: XCommunityTweets;
}

export interface XCommunityIntro {
  id: string;
  name: string;
  description: string;
  members: number;
}

export interface XCommunityTweets {
  tweets: XTweet[];
}

export interface XTweet {
  sender: string;
  id: string;
  content: string;
  media: string[];
  views: number;
  likes: number;
  reposts: XRepost[];
  quotes: XQuote[];
  replies: XReply[];
}

export interface XReply {
  sender: string;
  id: string;
  verified: boolean;
  content: string;
  media: string[];
  views: number;
  likes: number;
  reposts: number;
  quotes: number;
  replies: number;
}

export interface XRepost {
  sender: string;
  verified: boolean;
}

export interface XQuote {
  sender: string;
  id: string;
  verified: boolean;
  content: string;
  media: string[];
  views: number;
  likes: number;
  reposts: number;
  quotes: number;
  replies: number;
}

export interface XUser {
  id: string;
  name: string;
  verified: boolean;
  followers: number;
  likes: number;
  tweets: XUserTweet[];
}

export interface XUserTweet {
  id: string;
  content: string;
  media: string[];
  inCommunity: boolean;
  views: number;
  likes: number;
  reposts: number;
  quotes: number;
  replies: number;
  createdAt: Date;
}

// Helper types for ticker symbol filtering
export interface TickerFilter {
  symbols: string[];
  startDate?: Date;
  endDate?: Date;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
    cursor?: string;
  };
}