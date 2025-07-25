import { NextRequest } from 'next/server';

import * as whitelistService from '../../_lib/services/whitelistService';
import { withErrorHandler } from '../../_lib/utils/withErrorHandler';
import { success, error } from '../../_lib/utils/response';
import { getUserFromRequest } from '../../_lib/utils/getUserFromRequest';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return error('Not logged in.', 401);
  }
  const user = getUserFromRequest(req);
  if (!user) {
    return error('Invalid token.', 401);
  }
  const body = await req.json();
  const { referralCode } = body;
  const userDto = { userId: user.userId, twitterId: user.twitterId };
  const whitelist = await whitelistService.createWhitelist(userDto, referralCode);
  return success({ status: whitelist?.status });
}); 