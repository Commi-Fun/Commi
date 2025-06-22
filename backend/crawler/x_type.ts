
export interface XCommunity {
  intro: XCommunityIntro,
  tweets: XCommunityTweets,
}

export interface XCommunityIntro {
  id: string,
  name: string,
  description: string,
  members: number,
}

export interface XCommunityTweets {
  tweets: XTweet[],
}

export interface XTweet {
  sender: string,
  id: string,
  content: string,
  media: string[],
  views: number,
  likes: number,
  reposts: XRepost[],
  quotes: XQuote[],
  replies: XReply[],
}

export interface XReply {
  sender: string,
  id: string
  verified: boolean,
  content: string,
  media: string[],
  views: number,
  likes: number,
  reposts: number,
  quotes: number,
  replies: number,
}

export interface XRepost {
  sender: string,
  verified: boolean,
}

export interface XQuote {
  sender: string,
  id: string,
  verified: boolean,
  content: string,
  media: string[],
  views: number,
  likes: number,
  reposts: number,
  quotes: number,
  replies: number,
}


export interface XUser {
  id: string,
  name: string,
  verified: boolean,
  followers: number,
  likes: number,
  tweets: XUserTweet[],
}

export interface XUserTweet {
  id: string,
  content: string,
  media: string[],
  inCommunity: boolean,
  views: number,
  likes: number,
  reposts: number,
  quotes: number,
  replies: number,
  createdAt: Date,
}