import { NextRequest } from 'next/server';
import * as whitelistService from '../../_lib/services/whitelistService';
import { withErrorHandler } from '../../_lib/utils/withErrorHandler';
import { success, error } from '../../_lib/utils/response';
import { getUserFromRequest } from '../../_lib/utils/getUserFromRequest';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = getUserFromRequest(req);
  if (!user) {
    return error('Invalid token.', 401);
  }
  const result = await whitelistService.claimWhitelist(user);
  return success(result);
}); 