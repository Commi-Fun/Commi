#!/usr/bin/env node

import dotenv from 'dotenv';
import cron from 'node-cron';
import { CampaignStatus, prisma } from '@commi-dashboard/db';
import { calculateInfluenceScore } from 'packages/common/src';

// Load environment variables
dotenv.config();

class ComputeEngine {
  private isRunning: boolean = false;
  private cronJob: cron.ScheduledTask | null = null;
  private maxConcurrentTasks: number;
  private activeTasks: Set<string> = new Set();

  constructor() {
    this.maxConcurrentTasks = parseInt(process.env.MAX_CONCURRENT_TASKS || '50');
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Compute Engine is already running');
      return;
    }

    try {
      console.log('🚀 Starting Compute Engine');

      const cronExpression = process.env.COMPUTE_CRON || '*/5 * * * *';
      console.log(`📅 Scheduling compute engine with cron: ${cronExpression}`);

      this.cronJob = cron.schedule(cronExpression, async () => {
        await this.run();
      }, {
        scheduled: false
      });

      this.cronJob.start();
      this.isRunning = true;

      console.log('✅ Compute engine started successfully');

      // Run initial scheduling
      await this.run();

    } catch (error) {
      console.error('❌ Failed to start compute engine:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('Compute engine is not running');
      return;
    }

    try {
      if (this.cronJob) {
        this.cronJob.stop();
        this.cronJob = null;
      }

      this.isRunning = false;
      console.log('✅ Compute engine stopped');
    } catch (error) {
      console.error('❌ Error stopping compute engine:', error);
    }
  }

  private async run(): Promise<void> {
    try {
      console.log('🔄 Starting compute engine cycle...');

      const tweets = await this.getCampaignTweets();
      if (!tweets || tweets.size === 0) {
        console.log('⚠️  No tweets found for compute engine');
        return;
      }

      const promises: Promise<void>[] = [];
      for (const [tweetId, campaignIds] of tweets) {
        if (this.activeTasks.size >= this.maxConcurrentTasks) {
          await Promise.race(this.activeTasks.values());
        }
        
        const promise = this.process({ tweetId, campaignIds }).finally(() => {
          this.activeTasks.delete(tweetId);
        });
        
        this.activeTasks.add(tweetId);
        promises.push(promise);
      }
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('❌ Error in compute engine cycle:', error);
    }
  }

  private async getCampaignTweets(): Promise<Map<string, Array<number>>> {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: {
            status: CampaignStatus.ONGOING
        }
      })

      const campaignTweets = await prisma.campaignTweet.findMany({
        where: {
          id: {
            in: campaigns.map(c => c.id)
          }
        },
        select: {
          tweetId: true,
          campaignId: true
        }
      });
      let result: Map<string, Array<number>> = new Map();
      for (let i = 0; i < campaignTweets.length; i++) {
        const element = campaignTweets[i];
        let cids = result.get(element.tweetId)
        if (!cids || cids.length === 0) {
            cids = new Array<number>;
        }
        cids.push(element.campaignId)
        result.set(element.tweetId, cids)
      }
      return result
    } catch (error) {
      console.error('❌ Error fetching campaign tweets:', error);
      return new Map();
    }
  }

  private async process(tweet: { tweetId: string; campaignIds: Array<number> }): Promise<void> {
    try {
        const tweetEntity = await prisma.tweet.findFirst({
            where: {
                tweetId: tweet.tweetId
            },
            orderBy: {
                fetchedAt: 'desc'
            }
        })
        if (!tweetEntity) {
            return
        }
        const score = calculateInfluenceScore({
            views: tweetEntity.viewCount,
            likes: tweetEntity.likeCount,
            reposts: tweetEntity.retweetCount,
            quotes: tweetEntity.quoteCount,
            replies: tweetEntity.replyCount,
            followerCount: 0,
            isVerified: false,
        })
        await prisma.participation.updateMany({
            where: {
                campaignId: {
                    in: tweet.campaignIds
                },
                twitterId: tweetEntity.twitterId
            },
            data: {
                influenceScore: score
            }
        })
        // todo: auto distribution
      return;
    } catch (error) {
      console.error('❌ Error calculating user score:', error);
      return;
    }
  }
}


// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Shutting down gracefully...');
  if (global.computeEngine) {
    await global.computeEngine.stop();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM. Shutting down gracefully...');
  if (global.computeEngine) {
    await global.computeEngine.stop();
  }
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the compute engine
async function main() {
  console.log('🚀 Starting Compute Engine Service');
  console.log('========================================');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database URL: ${process.env.DATABASE_URL ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log('');

  // Validate required environment variables
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  try {
    const computeEngine = new ComputeEngine();
    global.computeEngine = computeEngine;
    
    await computeEngine.start();
  } catch (error) {
    console.error('❌ Failed to start compute engine:', error);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

// Global type declaration
declare global {
  var computeEngine: ComputeEngine | undefined;
} 