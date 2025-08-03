import { PrismaClient } from '@commi-dashboard/db/generated/prisma/client';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'test-secret';

// Test database client
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL
    }
  }
});

export interface MockUser {
  userId: number;
  twitterId: string;
}

// Test users
export const testUsers = {
  alice: { userId: 1, twitterId: 'alice123' },
  bob: { userId: 2, twitterId: 'bob456' },
  charlie: { userId: 3, twitterId: 'charlie789' },
  dave: { userId: 4, twitterId: 'dave012' }
};

// Helper to create valid JWT tokens
export function createValidToken(user: MockUser): string {
  return jwt.sign(
    { userId: user.userId, twitterId: user.twitterId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Helper to create invalid JWT tokens
export function createInvalidToken(): string {
  return jwt.sign(
    { userId: 999, twitterId: 'invalid' },
    'wrong-secret',
    { expiresIn: '7d' }
  );
}

// Helper to create expired JWT tokens
export function createExpiredToken(user: MockUser): string {
  return jwt.sign(
    { userId: user.userId, twitterId: user.twitterId },
    JWT_SECRET,
    { expiresIn: '-1s' }
  );
}

// Database cleanup helper
export async function cleanDatabase() {
  // Delete in correct order to respect foreign key constraints
  await prisma.referral.deleteMany();
  await prisma.whitelist.deleteMany();
  await prisma.user.deleteMany();
}

// Database seed helper
export async function seedDatabase() {

  // Create some initial whitelists
  await prisma.whitelist.create({
    data: {
      userId: testUsers.alice.userId,
      twitterId: testUsers.alice.twitterId,
      referralCode: 'ABC123',
      status: 'REGISTERED'
    }
  });

  await prisma.whitelist.create({
    data: {
      userId: testUsers.bob.userId,
      twitterId: testUsers.bob.twitterId,
      referralCode: 'XYZ789',
      status: 'CAN_CLAIM'
    }
  });

  await prisma.whitelist.create({
    data: {
      userId: testUsers.charlie.userId,
      twitterId: testUsers.charlie.twitterId,
      referralCode: 'DEF456',
      status: 'CLAIMED'
    }
  });
}

// Test lifecycle hooks
export async function setupTestDatabase() {
  await cleanDatabase();
  await seedDatabase();
}

export async function teardownTestDatabase() {
  await cleanDatabase();
  await prisma.$disconnect();
}