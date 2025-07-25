import { NextRequest } from 'next/server';
import * as whitelistService from '../../_lib/services/whitelistService';
import { getUserFromRequest } from '../../_lib/utils/getUserFromRequest';
import { withErrorHandler } from '../../_lib/utils/withErrorHandler';
import { success, error } from '../../_lib/utils/response';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return error('Not logged in.', 401);
  }
  const user = getUserFromRequest(req);
  if (!user) {
    return error('Invalid token.', 401);
  }
  const whitelist = await whitelistService.getWhitelist(user.twitterId);
  return success({ status: whitelist?.status });
}); 