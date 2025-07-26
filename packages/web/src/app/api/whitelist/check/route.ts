import { NextRequest } from 'next/server';
import * as whitelistService from '@/lib/services/whitelistService';
import * as authService from '@/lib/services/authService';
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import { success, error } from '@/lib/utils/response';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return error('Not logged in.', 401);
  }
  const token = authHeader.split(' ')[1];
  const payload = authService.verifyToken(token);
  if (!payload || typeof payload !== 'object' || !payload.twitterId) {
    return error('Invalid token.', 401);
  }
  const whitelist = await whitelistService.getWhitelist(payload.twitterId);
  return success({ status: whitelist?.status });
}); 