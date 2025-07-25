import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../packages/db/src/prisma_service';

describe('Database Integration', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
  });
})