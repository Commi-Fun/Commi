import * as whitelistService from '@/lib/services/whitelistService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'

export const GET = withErrorHandler(async () => {
  const sessionInfo = await getServerSession(nextAuthOptions)

  if (!sessionInfo) {
    return error('Invalid token.', 401)
  }

  console.log('sessionInfo.user.twitterId', sessionInfo.user.twitterId)

  const result = await whitelistService.getWhitelist(sessionInfo.user.twitterId)

  if (!result.success) {
    return error(result.error || 'Failed to get whitelist', 500)
  }

  return success(result.data)
})
