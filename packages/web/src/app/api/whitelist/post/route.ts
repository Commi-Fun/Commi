import { NextRequest } from 'next/server'

import * as whitelistService from '@/lib/services/whitelistService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { getServerSession } from 'next-auth'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getServerSession()
  if (!session) {
    return error('Unauthorized', 401)
  }
  const userDto = { userId: session.user.userId, twitterId: session.user.twitterId }
  const whitelist = await whitelistService.post(userDto as never)
  return success({ status: whitelist?.status })
})
