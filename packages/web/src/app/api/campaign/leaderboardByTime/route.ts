import { NextRequest } from 'next/server'
import * as campaignService from '@/lib/services/campaignService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json()
  const { campaignId, afterTime } = body
  
  if (!campaignId || !afterTime) {
    return error('Campaign ID and afterTime are required', 400)
  }
  
  const afterTimeDate = new Date(afterTime)
  if (isNaN(afterTimeDate.getTime())) {
    return error('Invalid afterTime format', 400)
  }
  
  const result = await campaignService.getLeaderboardByTime(campaignId, afterTimeDate)
  if (!result.success) {
    return error(result.error || 'Failed to get leaderboard by time', 500)
  }

  return success(result.data)
})