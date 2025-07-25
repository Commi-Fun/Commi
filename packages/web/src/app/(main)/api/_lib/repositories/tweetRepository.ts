import { prisma } from '../../../../../../../db/src/index';

export async function createTweet(data: any) {
  return prisma.tweet.create({ data });
}

export async function bulkCreateTweets(data: any) {
  await prisma.tweet.createMany({ data });
} 