import * as whitelistService from '@/lib/services/whitelistService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { getServerSession } from 'next-auth'

export const GET = withErrorHandler(async () => {
  const session = await getServerSession()
  if (!session) {
    return error('Unauthorized', 401)
  }
  const referees = await whitelistService.listReferees(session.user.twitterId)
  return success({ data: referees })
})
