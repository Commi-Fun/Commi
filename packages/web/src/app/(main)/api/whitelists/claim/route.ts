import { NextRequest } from 'next/server';
import * as whitelistService from '../../_lib/services/whitelistService';
import * as authService from '../../_lib/services/authService';
import { withErrorHandler } from '../../_lib/utils/withErrorHandler';
import { success, error } from '../../_lib/utils/response';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return error('Not logged in.', 401);
  }
  const token = authHeader.split(' ')[1];
  const payload = authService.verifyToken(token);
  if (!payload || !payload.userId || !payload.twitterId) {
    return error('Invalid token.', 401);
  }
  const userDto = { userId: payload.userId, twitterId: payload.twitterId };
  const result = await whitelistService.claimWhitelist(userDto);
  return success(result);
}); 