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
  const body = await req.json()
  const { referralCode } = body
  const userDto = { userId: session.user.userId, twitterId: session.user.twitterId }
  const result = await whitelistService.refer(userDto as never, referralCode)
  if (!result.success) {
    return error(result.error || 'Failed to refer', 500)
  }
  
  return success(result.data)
})
