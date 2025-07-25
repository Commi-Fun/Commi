import { NextRequest } from 'next/server';
import * as authService from '@/lib/services/authService';

export function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  const payload = authService.verifyToken(token);
  if (
    !payload ||
    typeof payload !== 'object' ||
    !('userId' in payload) ||
    !('twitterId' in payload)
  ) {
    return null;
  }
  return { userId: (payload as any).userId, twitterId: (payload as any).twitterId };
} 