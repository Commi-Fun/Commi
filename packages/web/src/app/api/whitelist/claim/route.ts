import * as whitelistService from '@/lib/services/whitelistService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'

export const POST = withErrorHandler(async () => {
  const session = await getServerSession(nextAuthOptions)
  if (!session || !session.user.userId) {
    return error('Invalid token.', 401)
  }
  const userDto = { userId: +session.user.userId, twitterId: session.user.twitterId }
  const result = await whitelistService.claimWhitelist(userDto as never)

  if (!result.success) {
    return error(result.error || 'Failed to claim', 500)
  }

  return success(result.data)
})
