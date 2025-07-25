import axios from 'axios';
import { prisma } from '@commi-dashboard/db';

export type TwitterUser = {
  id: string;
  name: string;
  screenName: string;
  avatar: string;
};

const apiUrl = 'https://api.twitter.com/2';

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