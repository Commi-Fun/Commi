export * from '../generated/prisma/client';
export { Prisma, PrismaClient } from '../generated/prisma/client';

// Re-export useful Prisma types
export type {
  User,
  Tweet,
  NFTDistribution,
  SystemConfig,
  CrawlerLog,
  DistributionStatus,
  Blockchain,
} from '../generated/prisma/client';

// Export Prisma client instance (to be used as singleton)
import { PrismaClient } from '../generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

export type PrismaTransaction = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export function getTransactionClient(tx: PrismaTransaction): PrismaTransaction {
  return tx as unknown as PrismaTransaction;
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;