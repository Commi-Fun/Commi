import { NextRequest } from 'next/server';
import * as whitelistService from '@/lib/services/whitelistService';
<<<<<<< HEAD
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import { success, error } from '@/lib/utils/response';
import { getUserFromRequest } from '@/lib/utils/getUserFromRequest'
=======
import * as authService from '@/lib/services/authService';
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import { success, error } from '@/lib/utils/response';
>>>>>>> dev

export const POST = withErrorHandler(async (req: NextRequest) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) {
    return error('Not logged in.', 401);
  }
<<<<<<< HEAD
  const user = getUserFromRequest(req);
  if (!user) {
=======
  const token = authHeader.split(' ')[1];
  const payload = authService.verifyToken(token);
  if (!payload || typeof payload !== 'object' || !payload.userId || !payload.twitterId) {
>>>>>>> dev
    return error('Invalid token.', 401);
  }
  const userDto = { twitterId: user.twitterId };
  const result = await whitelistService.claimWhitelist(userDto);
  return success(result);
}); 