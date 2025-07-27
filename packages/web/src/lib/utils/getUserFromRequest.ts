import { NextRequest } from 'next/server';
import * as authService from '@/lib/services/authService';
import { prisma } from '@commi-dashboard/db';

export async function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  const payload = authService.verifyToken(token);
  if (
    !payload ||
    typeof payload !== 'object' ||
    !('id' in payload)
  ) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { twitterId: (payload as any).id} });
  if (!user) {
    return null
  }
  
  return { id: user.id, twitterId: user.twitterId };
} 