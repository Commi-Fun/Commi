import axios from 'axios';
import { prisma } from '@commi-dashboard/db';
import { ServiceError } from '../utils/errors';
import { safeGet, safeGetArray } from '../../../../common/src/helper';

export type TwitterUser = {
  id: string;
  name: string;
  screenName: string;
  avatar: string;
};

export interface TweetDataResponse {
  id: string;
  author: string;
  urls: string[];
  hashtags: string[];
  mentions: string[];
  content: string;
}

const apiUrl = 'https://api.twitter.com/2';
const cdn = 'https://cdn.syndication.twimg.com/tweet-result';

export async function getMe(accessToken: string): Promise<TwitterUser | null> {
  try {
    const response = await axios.get(`${apiUrl}/users/me`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      params: {
        'user.fields': 'id,name,username,profile_image_url',
      },
    });
    return {
      id: response.data.data.id,
      name: response.data.data.name,
      screenName: response.data.data.username,
      avatar: response.data.data.profile_image_url,
    };
  } catch (error) {
    throw new Error('Failed to verify Twitter credentials: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

// Tweet repository functions
export async function createTweet(data: any) {
  return prisma.tweet.create({ data });
}

export async function bulkCreateTweets(data: any) {
  await prisma.tweet.createMany({ data });
} 

export async function fetchTweetFromCDN(tweetId: string): Promise<TweetDataResponse | null> {
  const token = getToken(tweetId);
  const url = cdn+`?id=${tweetId}&token=${token}`;

  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      throw new ServiceError("Fetch tweet error");
    }

    // Validate that we received a valid response object
    if (!response.data || typeof response.data !== 'object') {
      throw new ServiceError("Invalid tweet response");
    }

    return {
      id: safeGet(response.data, "id_str"),
      author: safeGet(response.data, "user.id_str"),
      urls: safeGetArray(response.data, "entities.urls").map((url: any) => {
        return safeGet(url, "expanded_url");
      }),
      hashtags: safeGetArray(response.data, "entities.hashtags").map((tag: any) => {
        return safeGet(tag, "text");
      }),
      mentions: safeGetArray(response.data, "entities.mentions").map((mention: any) => {
        return safeGet(mention, "screen_name");
      }),
      content: safeGet(response.data, "text")
    };
  } catch (error) {
    throw new ServiceError("Fetch tweet error");
  }
}

function getToken(id: string) {
  return ((Number(id) / 1e15) * Math.PI)
    .toString(6 ** 2)
    .replace(/(0+|\.)/g, '');
}

export function validateTweetLink(link: string): string | null {
  if (typeof link !== 'string' || !link.trim()) return null;

  try {
    const url = new URL(link);
  
    const validDomains = [
      'twitter.com', 
      'www.twitter.com',
      'mobile.twitter.com',
      'x.com',
      'www.x.com',
      'mobile.x.com'
    ];
    
    if (!validDomains.includes(url.hostname.toLowerCase())) {
      return null;
    }

    const pathParts = url.pathname.split('/').filter(Boolean);
    
    if (pathParts.length < 3) return null;
    
    const statusIndex = pathParts.findIndex(part => 
      part.toLowerCase() === 'status'
    );
    
    if (statusIndex === -1 || statusIndex >= pathParts.length - 1) return null;
    
    const tweetId = pathParts[statusIndex + 1];
    
    if (!isValidTweetId(tweetId)) return null;

    return tweetId;
  } catch (error) {
    return null;
  }
}

function isValidTweetId(id: string): boolean {
  if (!/^\d+$/.test(id)) return false;
  
  const length = id.length;
  if (length < 18 || length > 21) return false;
  
  const numericId = BigInt(id);
  const MIN_ID = 20n;
  const MAX_ID = 2n ** 64n;
  
  return numericId >= MIN_ID && numericId <= MAX_ID;
}