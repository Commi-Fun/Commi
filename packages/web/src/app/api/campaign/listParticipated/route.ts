import { error, success } from '@/lib/utils/response'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { getServerSession } from 'next-auth'
import * as campaignService from '@/lib/services/campaignService'
import { NextRequest, NextResponse } from 'next/server'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'

export const GET = withErrorHandler(async (req: NextRequest): Promise<NextResponse<unknown>> => {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    return error('Invalid token.', 401)
  }
  const userDto = { userId: session.user.userId, twitterId: session.user.twitterId }
  const result = await campaignService.listUserParticipatedCampaigns(userDto)
  if (!result.success) {
    return error(result.error || 'Failed to list participated campaigns', 500)
  }

  return success(result.data)
})
