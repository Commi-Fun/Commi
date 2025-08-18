import { NextRequest } from 'next/server';
import * as campaignService from '@/lib/services/campaignService';
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import { success, error } from '@/lib/utils/response';
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'
import { UserDTO } from '@/types/dto';

export const GET = withErrorHandler(async (req: NextRequest) => {
  let userDto: UserDTO | null
  const session = await getServerSession(nextAuthOptions)
  if (session) {
    userDto = { userId: session.user.userId, twitterId: session.user.twitterId } 
  } else {
    userDto = null
  }
  
  // Get campaign ID from query parameters
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return error('Campaign ID is required', 400)
  }
  
  const campaignId = parseInt(id, 10)
  if (isNaN(campaignId)) {
    return error('Invalid campaign ID', 400)
  }
  
  const result = await campaignService.get(userDto as never, campaignId)
  if (!result.success) {
    return error(result.error || 'Failed to get campaign', 500)
  }

  return success(result.data)
}); 