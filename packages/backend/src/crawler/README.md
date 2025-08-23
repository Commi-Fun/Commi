# Simplified Task-Based Crawler Architecture

This document describes the simplified task-based crawler that uses the database as the task queue instead of RabbitMQ.

## Architecture Overview

```
[Cron] → [Scheduler] → [Database Tasks] → [Workers] → [RapidAPI] → [Database]
```

### Components

1. **Scheduler** (`scheduler.ts`)
   - Runs on a cron schedule (default: every 1 hour)
   - Queries database for users in active campaigns
   - Creates task records in the database

2. **Database Task Queue** (Prisma `crawlerTask` table)
   - Stores tasks with status tracking
   - Provides durability and persistence
   - Enables task retry and monitoring

3. **Workers** (`worker.ts`)
   - Multiple workers can run simultaneously
   - Poll database for queued tasks
   - Fetch tweets from RapidAPI
   - Update task status and results
   - Process tasks concurrently using Node.js I/O

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# RapidAPI
RAPIDAPI_KEY="your_rapidapi_key"

# Scheduler Configuration
CRAWLER_CRON="0 * * * *"                    # Every hour
CRAWLER_MAX_TWEETS_PER_USER=50                # Max tweets per user

# Worker Configuration
MAX_CONCURRENT_TASKS=5                         # Max tasks per worker
POLLING_INTERVAL=5000                          # Poll interval in ms
WORKER_BATCH_SIZE=100                          # Database batch size
MAX_WORKERS=10                                 # Max workers in system
```

## Usage

### Start the Scheduler

```bash
# Start the scheduler
pnpm scheduler
```

### Start Workers

```bash
# Start a worker
pnpm worker

# Start multiple workers (in separate terminals)
pnpm worker  # Terminal 1
pnpm worker  # Terminal 2
pnpm worker  # Terminal 3
```

### Using PM2 (Recommended for Production)

```bash
# Start scheduler
pm2 start "pnpm scheduler" --name "crawler-scheduler"

# Start multiple workers
pm2 start "pnpm worker" --name "crawler-worker-1"
pm2 start "pnpm worker" --name "crawler-worker-2"
pm2 start "pnpm worker" --name "crawler-worker-3"
```

## How It Works

### 1. Task Scheduling

The scheduler runs on a cron schedule and:

1. Queries database for users in active campaigns
2. Creates task records in `crawlerTask` table
3. Sets initial status as `QUEUED`
4. Includes task data (userId, twitterId, handle, maxTweets) in message field

### 2. Task Processing

Workers continuously poll the database and:

1. Fetch queued tasks (status = `QUEUED`)
2. Update status to `PROCESSING`
3. Parse task data from message field
4. Fetch tweets from RapidAPI
5. Batch insert tweets to database
6. Update task result and status to `SUCCESS`

### 3. Error Handling

- Failed tasks are marked for retry (up to maxAttempts)
- Permanent failures are marked as `FAILED`
- Individual task failures don't affect other tasks

### 4. Concurrency Control

- Workers limit concurrent tasks per worker (`MAX_CONCURRENT_TASKS`)
- Database polling prevents overwhelming the system
- Node.js event loop handles I/O concurrency naturally

## Task Status Flow

```
QUEUED → PROCESSING → COMPLETED
    ↓
  RETRY → PROCESSING → COMPLETED
    ↓
  FAILED (after max attempts)
```

## Monitoring

### Scheduler Status

```bash
# Check scheduler logs
pm2 logs crawler-scheduler
```

### Worker Status

```bash
# Check worker logs
pm2 logs crawler-worker-1
```

## Performance Tuning

### For High Load

1. **Increase Concurrency**:
   ```env
   MAX_CONCURRENT_TASKS=10
   ```

2. **Reduce Polling Interval**:
   ```env
   POLLING_INTERVAL=2000  # 2 seconds
   ```

3. **Increase Batch Size**:
   ```env
   WORKER_BATCH_SIZE=200
   ```

### For Low Load

1. **Reduce Concurrency**:
   ```env
   MAX_CONCURRENT_TASKS=2
   ```

2. **Increase Polling Interval**:
   ```env
   POLLING_INTERVAL=10000  # 10 seconds
   ```

## Troubleshooting

### Common Issues

1. **Tasks not being processed**:
   - Check worker logs for errors
   - Verify database connection
   - Check if workers are running

2. **High memory usage**:
   - Reduce `MAX_CONCURRENT_TASKS`
   - Increase `POLLING_INTERVAL`
   - Monitor for memory leaks

3. **Database connection issues**:
   - Check `DATABASE_URL`
   - Verify database is accessible
   - Check connection pool settings

### Debug Mode

Add debug logging:

```env
DEBUG=*  # Enable all debug logs
```