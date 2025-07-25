import { Test, TestingModule } from '@nestjs/testing';
import { TweetRepository } from '../../packages/web/src/api/repositories/tweet_repository';
import { PrismaService } from '../../packages/db/src/prisma_service';

describe('TweetRepository', () => {
  let repository: TweetRepository;
  let prisma: PrismaService;


  beforeEach(async () => {
    prisma = new PrismaService();
    await prisma.$connect();

    // 清空其他测试数据
    await prisma.tweet.deleteMany();
    
    repository = new TweetRepository(prisma);
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  it('should create raw tweets', async () => {
    const tweetData = {
      tweetId: 'tweet123',
      userId: 0,
      user: {},
      createdAt: new Date(),
      text: "",
    };
    
    const tweet = await repository.createTweet(tweetData);
    expect(tweet).toBeDefined();
    expect(tweet.tweetId).toBe('tweet123');
  });

  it('should bulk create raw tweets', async () => {
    const tweetsData = [
      {
        tweetId: 'tweet0',
        authorId: 'user0',
        userId: 0,
        campaignId: 0,
        createdAt: new Date(),
        likes: 50,
        retweets: 10,
        replies: 2,
        impressions: 500,
        text: "This is tweet0"
      },
      {
        tweetId: 'tweet1',
        authorId: 'user1',
        userId: 1,
        campaignId: 0,
        createdAt: new Date(),
        likes: 30,
        retweets: 5,
        replies: 1,
        impressions: 300,
        text: "This is tweet1"
      }
    ];
    
    await repository.bulkCreateRawTweets(tweetsData);
  });
});