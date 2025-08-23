import { CrawlerTaskStatus, CrawlerTaskType, prisma } from '@commi-dashboard/db';
import { CrawlerTask } from '@commi-dashboard/db';

export interface CrawlerTaskDomain {
  sourceId: string;
  type: CrawlerTaskType;
  metadata?: any,
  status: CrawlerTaskStatus;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export class TaskManager {
  async createTask(task: CrawlerTaskDomain): Promise<number> {
    const taskCreate = await prisma.crawlerTask.create({
      data: {
        sourceId: task.sourceId,
        type: task.type,
        metadata: task.metadata,
        status: CrawlerTaskStatus.QUEUED,
      }
    });

    return taskCreate.id;
  }

  async updateTaskStatus(taskId: number, status: CrawlerTaskStatus, error?: string): Promise<void> {
    const updateData: any = {
      status,
    };

    if (status === CrawlerTaskStatus.PROCESSING) {
      updateData.startedAt = new Date();
    } else if (status === CrawlerTaskStatus.SUCCESS || status === CrawlerTaskStatus.FAILED) {
      updateData.completedAt = new Date();
    }

    if (error) {
      updateData.error = error;
    }

    await prisma.crawlerTask.update({
      where: { id: taskId },
      data: updateData
    });
  }

  async incrementAttempts(taskId: number, error?: string): Promise<void> {
    await prisma.crawlerTask.update({
      where: { id: taskId },
      data: {
        attempts: { increment: 1 },
        status: CrawlerTaskStatus.QUEUED,
        error: error
      }
    });
  }

  async updateTaskResult(taskId: number, result: any): Promise<void> {
    await prisma.crawlerTask.update({
      where: { id: taskId },
      data: {
        status: CrawlerTaskStatus.SUCCESS,
        completedAt: new Date(),
        result: result
      }
    });
  }

  async getQueuedTasks(limit: number = 100): Promise<CrawlerTask[]> {
    return await prisma.crawlerTask.findMany({
      where: {
        status: CrawlerTaskStatus.QUEUED,
        attempts: { lt: 3 }, // Max 3 attempts
      },
      orderBy: { createdAt: 'asc' },
      take: limit
    })
  }
} 