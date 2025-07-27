import * as whitelistService from '@/lib/services/whitelistService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'

export const GET = withErrorHandler(async () => {
  // const authHeader = req.headers.get('authorization')
  const sessionInfo = await getServerSession(nextAuthOptions)

  if (!sessionInfo) {
    return error('Invalid token.', 401)
  }

  const whitelist = await whitelistService.getWhitelist(sessionInfo.user.twitterId)
  return success(whitelist)
})
