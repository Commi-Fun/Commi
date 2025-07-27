import { NextRequest } from 'next/server';

import * as whitelistService from '@/lib/services/whitelistService';
import * as authService from '@/lib/services/authService';
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import { success, error } from '@/lib/utils/response';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return error('Not logged in.', 401);
  }
  const token = authHeader.split(' ')[1];
  const payload = authService.verifyToken(token);
  if (!payload || typeof payload !== 'object' ||!payload.userId || !payload.twitterId) {
    return error('Invalid token.', 401);
  }
  const body = await req.json();
  const { referralCode } = body;
  const userDto = { userId: payload.userId, twitterId: payload.twitterId };
  
  try {
    const whitelist = await whitelistService.createWhitelistForUser(userDto, referralCode);
    return success({ status: whitelist.status });
  } catch (unknown) {
    console.error("Error: ", unknown);
    return error('Failed to create whitelist.', 500);
  }
}); 