import { PrismaClient } from '@commi-dashboard/db/generated/prisma/client';
import jwt from 'jsonwebtoken';
import * as userService from '@/lib/services/userService';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'changeme';

export async function validateUser(prisma: PrismaClient, twitterId: string) {
  if (!twitterId) return null;
  return userService.findUserByTwitterId(twitterId);
}

export function createToken(user: any) {
  const payload = { userId: user.id, twitterId: user.twitterId };
  return {
    access_token: jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }),
  };
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
} 