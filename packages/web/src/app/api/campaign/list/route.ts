import * as campaignService from '@/lib/services/campaignService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'

export const GET = withErrorHandler(async () => {
  const result = await campaignService.list()
  if (!result.success) {
    return error(result.error || 'Failed to list campaigns', 500)
  }

  return success(result.data)
})
