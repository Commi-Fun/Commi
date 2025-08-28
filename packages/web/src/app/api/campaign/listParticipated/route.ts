import { error, success } from '@/lib/utils/response'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'

import * as campaignService from '@/lib/services/campaignService'
import { NextRequest, NextResponse } from 'next/server'
export const GET = withErrorHandler(async (req: NextRequest): Promise<NextResponse<unknown>> => {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return error('Invalid userId', 400)
  }
  const result = await campaignService.listUserParticipatedCampaigns(Number(userId))
  if (!result.success) {
    return error(result.error || 'Failed to list campaigns', 500)
  }

  return success(result.data)
})
