import { NextRequest } from 'next/server'
import * as campaignService from '@/lib/services/campaignService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    return error('Invalid token.', 401)
  }
  const userDto = { userId: session.user.userId, twitterId: session.user.id }
  const body = await req.json()
  const { campaignId } = body
  const result = await campaignService.joinCampaign(userDto, campaignId)
  if (!result.success) {
    return error(result.error || 'Failed to join campaign', 500)
  }

  return success(result.data)
})
