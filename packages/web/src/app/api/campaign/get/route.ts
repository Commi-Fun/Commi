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
  
  // Get campaign UID from query parameters
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid')
  
  if (!uid) {
    return error('Campaign UID is required', 400)
  }
  
  const result = await campaignService.get(userDto as never, uid)
  if (!result.success) {
    return error(result.error || 'Failed to get campaign', 500)
  }

  return success(result.data)
});