import { Tweet, Prisma } from '../../../../db/generated/prisma/client';
import { PrismaService } from '../../../../db/src/prisma_service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TweetRepository {
  constructor(private prisma: PrismaService) {}

  async createTweet(data: Prisma.TweetCreateInput): Promise<Tweet> {
    return this.prisma.tweet.create({ data });
  }

  async bulkCreateRawTweets(data: Prisma.TweetCreateManyInput[]): Promise<void> {
    await this.prisma.tweet.createMany({ data });
  }
}