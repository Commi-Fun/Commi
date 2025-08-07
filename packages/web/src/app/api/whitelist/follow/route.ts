import { NextRequest } from 'next/server'

import * as whitelistService from '@/lib/services/whitelistService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    return error('Unauthorized', 401)
  }
  const userDto = { userId: session.user.userId, twitterId: session.user.twitterId }
  const result = await whitelistService.follow(userDto as never)
  if (!result.success) {
    return error(result.error || 'Failed to follow', 500)
  }

  return success(result.data)
})
