import { NextRequest } from 'next/server';
import * as campaignService from '@/lib/services/campaignService';
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import { success, error } from '@/lib/utils/response';
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'
import { UserDTO } from '@/types/dto';
import { useRouter } from 'next/router';

export const GET = withErrorHandler(async (req: NextRequest) => {
  let userDto: UserDTO | null
  const session = await getServerSession(nextAuthOptions)
  if (session) {
    userDto = { userId: session.user.userId, twitterId: session.user.twitterId } 
  }else {
    userDto = null
  }
  const router = useRouter();
  const { id } = router.query;
  const result = await campaignService.get(userDto as never, id as never)
  if (!result.success) {
    return error(result.error || 'Failed to get campaign', 500)
  }

  return success(result.data)
}); 