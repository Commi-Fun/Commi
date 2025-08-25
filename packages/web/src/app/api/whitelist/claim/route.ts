import * as whitelistService from '@/lib/services/whitelistService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'
import { sseManager } from '@/lib/utils/sseManager'

export const POST = withErrorHandler(async () => {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    return error('Invalid token.', 401)
  }
  const userDto = { userId: session.user.userId, twitterId: session.user.twitterId }
  const result = await whitelistService.claimWhitelist(userDto as never)

  if (!result.success) {
    return error(result.error || 'Failed to claim', 500)
  }

  // Broadcast SSE event for successful claim
  try {
    sseManager.broadcastToUser(session.user.twitterId, {
      type: 'whitelist_update',
      twitterId: session.user.twitterId,
      data: {
        claimed: true,
      },
    })
  } catch (sseError) {
    console.error('Failed to broadcast claim SSE event:', sseError)
  }

  return success(result.data)
})
