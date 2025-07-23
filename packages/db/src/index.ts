export * from '../generated';
export { Prisma, PrismaClient } from '../generated';

// Re-export useful Prisma types
export type {
  User,
  Tweet,
  NFTDistribution,
  SystemConfig,
  CrawlerLog,
  DistributionStatus,
  Blockchain
} from '../generated';

// Export Prisma client instance (to be used as singleton)
import { PrismaClient } from '../generated';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;