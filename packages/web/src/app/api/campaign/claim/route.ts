import { NextRequest } from 'next/server';
import * as campaignService from '@/lib/services/campaignService';
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import { success, error } from '@/lib/utils/response';
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'
import { UserDTO } from '@/types/dto';
import { useRouter } from 'next/router';

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    return error('Invalid token.', 401)
  }
  const userDto = { userId: session.user.userId, twitterId: session.user.twitterId } 
  const body = await req.json()
  const { campaignId, txHash } = body
  const result = await campaignService.claim(userDto, campaignId, txHash)
  if (!result.success) {
    return error(result.error || 'Failed to calim rewards', 500)
  }

  return success(result.data)
}); 