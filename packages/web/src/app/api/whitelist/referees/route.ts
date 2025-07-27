import { NextRequest } from 'next/server';
import * as whitelistService from '@/lib/services/whitelistService';
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import { success, error } from '@/lib/utils/response';
import { getUserFromRequest } from '@/lib/utils/getUserFromRequest'

export const GET = withErrorHandler(async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return error('Not logged in.', 401);
  }
  const user = await getUserFromRequest(req);
  if (!user) {
    return error('Invalid token.', 401);
  }
  const referees = await whitelistService.listReferees(user.twitterId);
  return success({ data: referees });
}); 