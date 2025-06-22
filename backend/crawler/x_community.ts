import axios from 'axios';

import { XCommunityIntro, XCommunityTweets, XQuote, XRepost, XReply, XTweet, XCommunity } from './x_type';



async function fetchCommunityDetail(communityId: string): Promise<XCommunityIntro> {
  const response = await axios.get(
    `https://twitter241.p.rapidapi.com/community-details`,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': '52064c46e2mshca87ab34d1303f9p13bd1ajsn9fe385862abf',
        'x-rapidapi-host': 'twitter241.p.rapidapi.com'
      },
      params: {
        communityId,
      }
    }
  );
  
  if (response.status !== 200) {
    throw new Error(`Error fetching community ${communityId} detail: ${response.statusText}`);
  }
  const data: Record<string, any> = await response.data;


  const communityName = data?.result?.result?.name ?? '';
  const communityDescription = data?.result?.result?.description ?? '';
  const communityMembers = data?.result?.result?.member_count ?? '';

  return {
    id: communityId,
    name: communityName,
    description: communityDescription,
    members: communityMembers
  };

}

async function fetchCommunityTweets(communityId: string): Promise<XCommunityTweets> {
  const response = await axios.get(
    `https://twitter241.p.rapidapi.com/community-tweets`,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': '52064c46e2mshca87ab34d1303f9p13bd1ajsn9fe385862abf',
        'x-rapidapi-host': 'twitter241.p.rapidapi.com'
      },
      params: {
        communityId,
        searchType: 'Default',
        rankingMode: 'Recency',
      }
    }
  );

  if (response.status !== 200) {
    throw new Error(`Error fetching community ${communityId} tweets: ${response.statusText}`);
  }

  const data: Record<string, any> = await response.data;

  const instructions = (data?.result?.timeline?.instructions ?? []) as any[];
  if (instructions.length < 3) {
    throw new Error(`Unexpected response format for community ${communityId} tweets`);
  }
  const tweets = instructions[2].entries?.map((entry: any) => {
    return {
      id: entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.id_str ?? '',
      content: entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.full_text ?? '',
      sender: entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.user_id_str ?? '',
      // It only supports photo media for now
      media: (entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.extended_entities?.media?.filter((media: any) => {
        return media?.type === 'photo'
      }).map((media: any) => {
        return media?.media_url_https ?? '';
      })) ?? [],
      views: entry.content?.itemContent?.tweet_results?.result?.tweet?.views?.count ?? 0,
      likes: entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.favorite_count ?? 0,
      reposts: [],
      quotes: [],
      replies: [],
    }
  });

  return {
    tweets: tweets ?? []
  };
}

async function fetchTweetReplies(tweetId: string): Promise<XReply[]> {
  // TODO: cache replies count and fetch replies only if needed
  const response = await axios.get(
    `https://twitter241.p.rapidapi.com/comments-v2`,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': '52064c46e2mshca87ab34d1303f9p13bd1ajsn9fe385862abf',
        'x-rapidapi-host': 'twitter241.p.rapidapi.com'
      },
      params: {
        pid: tweetId,
        rankingMode: 'Recency',
      }
    }
  );

  if (response.status !== 200) {
    throw new Error(`Error fetching replies for tweet ${tweetId}: ${response.statusText}`);
  }

  const data = await response.data;
  const instructions = (data?.result?.timeline?.instructions ?? []) as any[];
  if (instructions.length < 1) {
    throw new Error(`Unexpected response format for tweet ${tweetId} replies`);
  }
  const replies = instructions[0].entries?.map((entry: any) => {
    const id = entry.content?.items[0]?.item?.itemContent?.tweet_results?.result?.tweet?.legacy?.id_str ?? '';
    if (!id) {
      throw new Error(`Missing reply ID in tweet ${tweetId} entry`);
    }
    return {
      id,
      content: entry.content?.items[0]?.item?.itemContent?.tweet_results?.result?.tweet?.legacy?.full_text ?? '',
      sender: entry.content?.items[0]?.item?.itemContent?.tweet_results?.result?.tweet?.legacy?.user_id_str ?? '',
      verified: entry.content?.items[0]?.item?.itemContent?.tweet_results?.result?.tweet?.author_community_relationship?.user_results?.result?.is_blue_verified ?? false,
      media: (entry.content?.items[0]?.item?.itemContent?.tweet_results?.result?.tweet?.legacy?.entities?.media ?? []).filter((media: any) => {
        return media?.type === 'photo'
      }).map((media: any) => {
        return media?.media_url_https ?? '';
      }) ?? [],
      views: entry.content?.items[0]?.item?.itemContent?.tweet_results?.result?.tweet?.view?.count ?? 0,
      likes: entry.content?.items[0]?.item?.itemContent?.tweet_results?.result?.tweet?.legacy?.favorite_count ?? 0,
      reposts: entry.content?.items[0]?.item?.itemContent?.tweet_results?.result?.tweet?.legacy?.retweet_count ?? 0,
      quotes: entry.content?.items[0]?.item?.itemContent?.tweet_results?.result?.tweet?.legacy?.quote_count ?? 0,
      replies: entry.content?.items[0]?.item?.itemContent?.tweet_results?.result?.tweet?.legacy?.reply_count ?? 0,
    };
  });
  return replies ?? [];
}

async function fetchTweetReposts(tweetId: string): Promise<XRepost[]> {
  const response = await axios.get(
    `https://twitter241.p.rapidapi.com/retweets`,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': '52064c46e2mshca87ab34d1303f9p13bd1ajsn9fe385862abf',
        'x-rapidapi-host': 'twitter241.p.rapidapi.com'
      },
      params: {
        pid: tweetId,
        count: '10000000000'
      }
    }
  );

  if (response.status !== 200) {
    throw new Error(`Error fetching reposts for tweet ${tweetId}: ${response.statusText}`);
  }

  const data = await response.data;
  const instructions = (data?.result?.timeline?.instructions ?? []) as any[];
  if (instructions.length < 1) {
    throw new Error(`Unexpected response format for tweet ${tweetId} reposts`);
  }
  const reposts = instructions[0].entries?.map((entry: any) => {
    return {
      sender: entry.content?.itemContent?.user_results?.result?.rest_id ?? '',
      verified: entry.content?.itemContent?.user_results?.result?.legacy?.verified ?? false,
    };
  });
  return reposts ?? [];
}

async function fetchTweetQuotes(tweetId: string): Promise<XQuote[]> {
  const response = await axios.get(
    `https://twitter241.p.rapidapi.com/quotes`,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': '52064c46e2mshca87ab34d1303f9p13bd1ajsn9fe385862abf',
        'x-rapidapi-host': 'twitter241.p.rapidapi.com'
      },
      params: {
        pid: tweetId,
        count: '10000000000'
      }
    }
  );

  if (response.status !== 200) {
    throw new Error(`Error fetching quotes for tweet ${tweetId}: ${response.statusText}`);
  }

  const data = await response.data;
  const instructions = (data?.result?.timeline?.instructions ?? []) as any[];
  if (instructions.length < 1) {
    throw new Error(`Unexpected response format for tweet ${tweetId} quotes`);
  }
  const quotes = instructions[0].entries?.map((entry: any) => {
    return {
      sender: entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.user_id_str ?? '',
      verified: entry.content?.itemContent?.user_results?.result?.legacy?.verified ?? false,
      content: entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.full_text ?? '',
      id: entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.id_str ?? '',
      media: (entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.entities?.media ?? []).filter((media: any) => {
        return media?.type === 'photo'
      }).map((media: any) => {
        return media?.media_url_https ?? '';
      }) ?? [],
      views: entry.content?.itemContent?.tweet_results?.result?.tweet?.view?.count ?? 0,
      likes: entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.favorite_count ?? 0,
      reposts: entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.retweet_count ?? 0,
      quotes: entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.quote_count ?? 0,
      replies: entry.content?.itemContent?.tweet_results?.result?.tweet?.legacy?.reply_count ?? 0,
    };
  });
  return quotes ?? [];
}

async function fetchCommunity(communityId: string): Promise<XCommunity | null> {

  let communityIntro: XCommunityIntro;
  let communityTweets: XCommunityTweets;

  try {
    communityIntro = await fetchCommunityDetail(communityId);
    communityTweets = await fetchCommunityTweets(communityId);
    // filter out tweets with trivial ids
    communityTweets.tweets = communityTweets.tweets.filter(tweet => tweet.id !== '');
    // fetch replies, reposts and quotes for each tweet
    for (const tweet of communityTweets.tweets) {
      tweet.replies = await fetchTweetReplies(tweet.id);
      // filter out replies with trivial ids
      tweet.replies = tweet.replies.filter(reply => reply.id !== '');
      
      tweet.reposts = await fetchTweetReposts(tweet.id);
      // filter out reposts with trivial senders
      tweet.reposts = tweet.reposts.filter(repost => repost.sender !== '');

      tweet.quotes = await fetchTweetQuotes(tweet.id);
      // filter out quotes with trivial ids
      tweet.quotes = tweet.quotes.filter(quote => quote.id !== '');
    }
  } catch (error) {
    console.error(`Error fetching community ${communityId}:`, error);
    return null;
  }  
  return {
    intro: communityIntro,
    tweets: communityTweets
  };
}



