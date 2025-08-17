import { NextRequest } from 'next/server';
import * as userService from '@/lib/services/userService';
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import { success, error } from '@/lib/utils/response';
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    return error('Unauthorized', 401)
  }
  const userDto = { userId: session.user.userId, twitterId: session.user.twitterId }
  const body = await req.json()
  const { address, signature } = body
  const result = await userService.connect(userDto as never, { address, signature })
  if (!result.success) {
    return error(result.error || 'Failed to connect wallet', 500)
  }

  return success(result.data)
}); 