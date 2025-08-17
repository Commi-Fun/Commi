import { NextRequest } from 'next/server';
import * as campaignService from '@/lib/services/campaignService';
import { withErrorHandler } from '@/lib/utils/withErrorHandler';
import { success, error } from '@/lib/utils/response';
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'
import { UserDTO } from '@/types/dto';
import { useRouter } from 'next/router';

export const GET = withErrorHandler(async (req: NextRequest) => {
  const result = await campaignService.list()
  if (!result.success) {
    return error(result.error || 'Failed to list campaigns', 500)
  }

  return success(result.data)
}); 