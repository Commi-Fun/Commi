#!/usr/bin/env node

import dotenv from 'dotenv';
import cron from 'node-cron';
import { CampaignStatus, CrawlerTask, CrawlerTaskStatus, prisma } from '@commi-dashboard/db';
import { fetchUserTweets } from './x_users';
import { TickerFilter, XUserTweet } from '@commi-dashboard/common';
import { TaskManager } from './task_manager';
import { format } from 'date-fns';

// Load environment variables
dotenv.config();

export class Worker {
  private isRunning: boolean = false;
  private taskManager: TaskManager;
  private maxConcurrentTasks: number;
  private cronJob: cron.ScheduledTask | null = null;
  private activeTasks: Set<number> = new Set();

  constructor() {
    this.taskManager = new TaskManager();
    this.maxConcurrentTasks = parseInt(process.env.MAX_CONCURRENT_TASKS || '50');
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Crawler Worker is already running');
      return;
    }

    try {
      console.log('🚀 Starting Crawler Worker');
      this.isRunning = true;

      // Start polling for tasks
      const cronExpression = process.env.WORKER_CRON || '*/5 * * * *';
      console.log(`📅 Scheduling crawler worker with cron: ${cronExpression}`);

      this.cronJob = cron.schedule(cronExpression, async () => {
        await this.run();
      }, {
        scheduled: false
      });

      this.cronJob.start();
      this.isRunning = true;

      console.log('✅ Crawler Worker started successfully');

      // Run initial task
      await this.run();
    } catch (error) {
      console.error('❌ Failed to start crawler worker:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('Crawler Worker is not running');
      return;
    }

    try {
      this.isRunning = false;

      // Wait for active tasks to complete
      while (this.activeTasks.size > 0) {
        console.log(`Waiting for ${this.activeTasks.size} active tasks to complete...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      console.log('✅ Crawler Worker stopped');
    } catch (error) {
      console.error('❌ Error stopping crawler worker:', error);
    }
  }

  private async run() {
    console.log("🔄 Starting crawler worker cycle...")
    if (!this.isRunning) return;

    try {
      // Fetch queued tasks from database
      const tasks = await this.taskManager.getQueuedTasks();

      if (tasks.length === 0) {
        console.log('📭 No queued tasks');
        return;
      }
      console.log(`📦 Found ${tasks.length} tasks to process`);

      // Process tasks concurrently
      const promises: Promise<void>[] = [];
      for (const task of tasks) {
        if (this.activeTasks.size >= this.maxConcurrentTasks) {
          await Promise.race(this.activeTasks.values());
        }
        
        const promise = this.processTask(task).finally(() => {
          this.activeTasks.delete(task.id);
        });
        
        this.activeTasks.add(task.id);
        promises.push(promise);
      }
      
      await Promise.allSettled(promises);
    } catch (error) {
      console.error('❌ Error in task polling:', error);
    }
  }

  private async processTask(taskRecord: CrawlerTask): Promise<void> {
    const taskId = taskRecord.id;
    
    if (this.activeTasks.has(taskId)) {
      console.log(`⏳ Task ${taskId} already being processed`);
      return;
    }

    try {
      console.log(`🔄 Processing task ${taskId}`);

      // Update task status to processing
      await this.taskManager.updateTaskStatus(taskId, CrawlerTaskStatus.PROCESSING);

      // Parse task data
      const metadata = taskRecord.metadata as any;
      const userId = Number(metadata?.userId);
      const twitterId = String(metadata?.twitterId || '');
      const handle = String(metadata?.handle || twitterId || 'unknown');
      console.log(`📝 Task data: ${handle} (${twitterId})`);

      if (!userId || !twitterId) {
        throw new Error('Task metadata missing required fields: userId or twitterId');
      }

      // Build a single filters array from user's ongoing campaigns
      const campaigns = await prisma.$queryRaw<any[]>`SELECT c.id, c.ticker, c.startTime FROM Participation p INNER JOIN Campaign c ON p.campaignId = c.id WHERE p.userId = ${userId} AND c.status = ${CampaignStatus.ONGOING} ORDER BY c.startDate`
      if (campaigns.length === 0) {
        console.log('⚠️  No ongoing campaigns for user');
        await this.taskManager.updateTaskResult(taskId, { tweetsInserted: 0 });
        return;
      }

      const filters: TickerFilter[] = campaigns.map(c => ({ symbols: [c.ticker], startDate: c.startTime }));

      let tweets: XUserTweet[] = [];
      let stopLoop = false
      let cursor = ''
      while (!stopLoop) {
        // Fetch tweets once and let the API-level filter handle ticker/time filtering
        const response = await fetchUserTweets({ userId: twitterId, communityId: undefined, cursor: cursor, filters });
        console.log(`📥 Fetched ${response.tweets.length} tweets for ${handle}`);
      
        if (response.tweets.length > 0) {
          tweets = [...tweets, ...response.tweets]
          stopLoop = response.tweets[response.tweets.length - 1].createdAt < campaigns[0].startDate
        }
        stopLoop = stopLoop || !response.bottomCursor
        cursor = response.bottomCursor
      }

      await this.batchInsertTweets(tweets, twitterId);

      // async match tweet with campaign
      await this.processCampaignTweetMatch(tweets)
      console.log(`💾 Inserted ${tweets.length} tweets for ${handle}`);

      // Update task result
      await this.taskManager.updateTaskResult(taskId, { tweetsInserted: tweets.length });

      console.log(`✅ Task ${taskId} completed successfully`);

    } catch (error: any) {
      console.error(`❌ Error processing task ${taskId}:`, error);

      if (taskRecord.attempts < taskRecord.maxAttempts) {
        await this.taskManager.incrementAttempts(taskId);
        console.log(`🔄 Task ${taskId} marked for retry (attempt ${taskRecord.attempts + 1}/${taskRecord.maxAttempts})`);
      } else {
        await this.taskManager.updateTaskStatus(taskId, CrawlerTaskStatus.FAILED, error.message);
        console.log(`💥 Task ${taskId} failed permanently`);
      }
    }
  }

  private async processCampaignTweetMatch(tweets: XUserTweet[]) {
    for (const i in tweets) {
      if (Object.prototype.hasOwnProperty.call(tweets, i)) {
        const tweet = tweets[i];
        const campaigns = await prisma.campaign.findMany({
          where: {
            ticker: {
              in: tweet.symbol
            }
          },
          select: {
            id: true
          }
        })
        if (campaigns !== null && campaigns.length > 0) {
          const campaignTweets = campaigns.map(c => ({
            tweetId: tweet.id,
            campaignId: c.id
          }));
    
          await prisma.campaignTweet.createMany({
            data: campaignTweets,
            skipDuplicates: true
          });
        }
      }
    }
  }

  private async batchInsertTweets(tweets: XUserTweet[], twitterId: string): Promise<void> {
    try {
      const date = new Date();
      const fetchedAt = format(date, 'yyyy-MM-dd HH:mm');
      // Prepare tweets for batch insert
      const tweetData = tweets.map(tweet => ({
        tweetId: tweet.id,
        text: tweet.content,
        twitterId: twitterId,
        retweetCount: tweet.reposts,
        replyCount: tweet.replies,
        likeCount: tweet.likes,
        quoteCount: tweet.quotes,
        viewCount: tweet.views,
        tickerSymbols: tweet.symbol,
        fetchedAt: fetchedAt,
        tweetCreatedAt: new Date(tweet.createdAt),
        hasMedia: tweet.media.length > 0
      }));

      // Use Prisma's createMany for efficient batch insert
      await prisma.tweet.createMany({
        data: tweetData,
        skipDuplicates: true // Skip if tweet already exists
      });

    } catch (error) {
      console.error('❌ Error batch inserting tweets:', error);
      throw error;
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Shutting down gracefully...');
  if (global.worker) {
    await global.worker.stop();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM. Shutting down gracefully...');
  if (global.worker) {
    await global.worker.stop();
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

// Start the worker
async function main() {
  console.log('🚀 Starting Crawler Worker Service');
  console.log('=================================');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database URL: ${process.env.DATABASE_URL ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log(`RapidAPI Key: ${process.env.RAPIDAPI_KEY ? 'Configured' : 'NOT CONFIGURED'}`);
  console.log('');

  // Validate required environment variables
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  if (!process.env.RAPIDAPI_KEY) {
    console.error('❌ RAPIDAPI_KEY environment variable is required');
    process.exit(1);
  }

  try {
    const worker = new Worker();
    global.worker = worker;
    
    await worker.start();
  } catch (error) {
    console.error('❌ Failed to start crawler worker:', error);
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
  var worker: Worker | undefined;
} 