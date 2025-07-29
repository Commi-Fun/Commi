import * as whitelistService from '@/lib/services/whitelistService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { getServerSession } from 'next-auth'

export const GET = withErrorHandler(async () => {
  const session = await getServerSession()
  if (!session) {
    return error('Unauthorized', 401)
  }
  const result = await whitelistService.listReferees(session.user.twitterId)
  if (!result.success) {
    return error(result.error || 'Failed to get referees', 500)
  }
  
  return success(result.data)
})
