import * as campaignService from '@/lib/services/campaignService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { NextRequest } from 'next/server'

export const GET = withErrorHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get('page') ?? '1'
  const pageSize = searchParams.get('pageSize') ?? '20'
  if (isNaN(Number(page)) || isNaN(Number(pageSize))) {
    return error('Invalid page or pageSize', 400)
  }
  const result = await campaignService.list(Number(page), Number(pageSize))
  if (!result.success) {
    return error(result.error || 'Failed to list campaigns', 500)
  }

  return success(result.data)
})
