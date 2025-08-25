import { NextRequest } from 'next/server'

import * as whitelistService from '@/lib/services/whitelistService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'
import { sseManager } from '@/lib/utils/sseManager'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    return error('Unauthorized', 401)
  }
  const userDto = { userId: session.user.userId, twitterId: session.user.twitterId }
  const body = await req.json()
  const { postLink } = body
  const result = await whitelistService.post(userDto as never, postLink)
  if (!result.success) {
    return error(result.error || 'Failed to post', 500)
  }

  // Broadcast SSE event for successful post
  try {
    sseManager.broadcastToUser(session.user.twitterId, {
      type: 'whitelist_update',
      twitterId: session.user.twitterId,
      data: {
        posted: true,
      },
    })
  } catch (sseError) {
    console.error('Failed to broadcast post SSE event:', sseError)
  }

  return success(result.data)
})
