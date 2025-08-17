#!/usr/bin/env node

import dotenv from 'dotenv';
import cron from 'node-cron';
import { CampaignStatus, CrawlerTaskStatus, CrawlerTaskType, prisma } from '@commi-dashboard/db';
import { TaskManager, CrawlerTaskDomain } from './task_manager';

// Load environment variables
dotenv.config();

class Scheduler {
  private isRunning: boolean = false;
  private cronJob: cron.ScheduledTask | null = null;
  private taskManager: TaskManager;

  constructor() {
    this.taskManager = new TaskManager();
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Scheduler is already running');
      return;
    }

    try {
      console.log('🚀 Starting Task Scheduler');

      // Schedule the crawler task
      const cronExpression = process.env.CRAWLER_CRON || '*/30 * * * *';
      console.log(`📅 Scheduling crawler tasks with cron: ${cronExpression}`);

      this.cronJob = cron.schedule(cronExpression, async () => {
        await this.run();
      }, {
        scheduled: false
      });

      this.cronJob.start();
      this.isRunning = true;

      console.log('✅ Task scheduler started successfully');

      // Run initial task scheduling
      if (process.env.CRAWLER_RUN_ON_BOOT === 'true') {
        await this.run();
      }

    } catch (error) {
      console.error('❌ Failed to start scheduler:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('Scheduler is not running');
      return;
    }

    try {
      if (this.cronJob) {
        this.cronJob.stop();
        this.cronJob = null;
      }

      this.isRunning = false;
      console.log('✅ Task scheduler stopped');
    } catch (error) {
      console.error('❌ Error stopping scheduler:', error);
    }
  }

  private async run(): Promise<void> {
    try {
      console.log('🔄 Starting task scheduling cycle...');

      // Get users participating in active campaigns
      const activeUsers = await this.getActiveCampaignUsers();
      console.log(`📊 Found ${activeUsers.length} users in active campaigns`);

      if (activeUsers.length === 0) {
        console.log('⚠️  No users found in active campaigns');
        return;
      }

      // Create tasks for each user
      const tasks: CrawlerTaskDomain[] = activeUsers.map(user => ({
        sourceId: user.twitterId,
        type: CrawlerTaskType.USER_FETCH,
        status: CrawlerTaskStatus.QUEUED,
        metadata: {
          userId: user.id,
          twitterId: user.twitterId,
          handle: user.handle,
          maxTweets: 50
        }
      }));

      // Create tasks in database
      let createdCount = 0;
      for (const task of tasks) {
        try {
          const taskId = await this.taskManager.createTask(task);
          createdCount++;
          console.log(`✅ Created task ${taskId} for user ${task.metadata.handle}`);
        } catch (error) {
          console.error(`❌ Failed to create task for user ${task.metadata.handle}:`, error);
        }
      }

      console.log(`🎉 Successfully created ${createdCount}/${tasks.length} tasks`);

    } catch (error) {
      console.error('❌ Error in task scheduling cycle:', error);
    }
  }

  private async getActiveCampaignUsers(): Promise<Array<{ id: number; twitterId: string; handle: string }>> {
    try {
      // Query users participating in active campaigns
      const activeCampaigns = await prisma.campaign.findMany({
        where: {
          status: CampaignStatus.ONGOING
        }
      })
      const campaignUsers = await prisma.participation.findMany({
        where: {
          campaignId: { in: activeCampaigns.map(campaign => campaign.id) }
        },
        distinct: "userId"
      })

      const userIds = campaignUsers.map(user => user.id)
      
      const users = await prisma.user.findMany({
        where: {
          id: {
            in: userIds
          }
        },
        select: {
          id: true,
          twitterId: true,
          handle: true
        }
      });

      return users;
    } catch (error) {
      console.error('❌ Error fetching active campaign users:', error);
      return [];
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT. Shutting down gracefully...');
  if (global.scheduler) {
    await global.scheduler.stop();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nReceived SIGTERM. Shutting down gracefully...');
  if (global.scheduler) {
    await global.scheduler.stop();
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

// Start the scheduler
async function main() {
  console.log('🚀 Starting Simple Task Scheduler Service');
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
    const scheduler = new Scheduler();
    global.scheduler = scheduler;
    
    await scheduler.start();
  } catch (error) {
    console.error('❌ Failed to start scheduler:', error);
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
  var scheduler: Scheduler | undefined;
} 