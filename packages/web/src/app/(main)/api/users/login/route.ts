import { NextRequest } from 'next/server';
import * as twitterService from '../../_lib/services/twitterService';
import * as userService from '../../_lib/services/userService';
import * as authService from '../../_lib/services/authService';
import { withErrorHandler } from '../../_lib/utils/withErrorHandler';
import { success, error } from '../../_lib/utils/response';
import { UserDTO } from '../../_lib/types/dto';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { accessToken } = body;
  if (!accessToken) {
    return error('No valid token provided', 401);
  }
  // Get Twitter user from access token
  const twitterUser = await twitterService.getMe(accessToken);
  if (!twitterUser) {
    return error('Failed to verify Twitter credentials', 400);
  }
  // Create/update userInfo
  const userDto: UserDTO = {
    twitterId: twitterUser.id,
    name: twitterUser.name,
    username: twitterUser.screenName,
    profileImageUrl: twitterUser.avatar,
  };
  const user = await userService.createUser(userDto);
  // Generate JWT
  const token = authService.createToken(user);
  return success(token);
}); 