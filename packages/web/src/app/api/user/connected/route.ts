import { NextRequest } from 'next/server'
import * as userService from '@/lib/services/userService'
import { withErrorHandler } from '@/lib/utils/withErrorHandler'
import { success, error } from '@/lib/utils/response'
import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'

export const POST = withErrorHandler(async (req: NextRequest) => {
  const session = await getServerSession(nextAuthOptions)
  if (!session) {
    return error('Unauthorized', 401)
  }
  const body = await req.json()
  const { address } = body
  const result = await userService.userAndAddressConnected(session.user.userId, address)

  return success(result)
})
