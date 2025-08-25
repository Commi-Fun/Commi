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
  if (!session.user.isNew) {
    return error('Can not get referred after register', 400)
  }
  const body = await req.json()
  const { referralCode } = body
  const userDto = { userId: session.user.userId, twitterId: session.user.twitterId }
  const result = await whitelistService.refer(userDto as never, referralCode)
  if (!result.success) {
    return error(result.error || 'Failed to refer', 500)
  }

  // Broadcast SSE events for successful referral
  try {
    // Get referrer info to broadcast updates
    const referrerWhitelist = await whitelistService.getWhitelist(result.data?.referrerTwitterId)

    if (referrerWhitelist.success && referrerWhitelist.data) {
      // Notify the referrer that they got a new referral
      sseManager.broadcastToUser(result.data.referrerTwitterId, {
        type: 'whitelist_update',
        twitterId: result.data.referrerTwitterId,
        data: {
          referred: true,
        },
      })
    }
  } catch (sseError) {
    // Don't fail the API call if SSE broadcasting fails
    console.error('Failed to broadcast SSE events:', sseError)
  }

  return success(result.data)
})
