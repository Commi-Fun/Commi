import { NextRequest } from 'next/server';
import * as campaignService from '@/lib/services/campaignService';
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
  const result = await campaignService.create(userDto as never, body)
  if (!result.success) {
    return error(result.error || 'Failed to create campaign', 500)
  }

  return success(result.data)
}); 