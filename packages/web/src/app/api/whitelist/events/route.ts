import { getServerSession } from 'next-auth'
import { nextAuthOptions } from '../../auth/[...nextauth]/route'
import { sseManager } from '@/lib/utils/sseManager'
import { error } from '@/lib/utils/response'

export async function GET() {
  try {
    // Authenticate the user
    const session = await getServerSession(nextAuthOptions)
    if (!session) {
      return error('Unauthorized', 401)
    }

    const twitterId = session.user.twitterId

    if (!twitterId) {
      return error('Invalid user session', 400)
    }

    console.log(`Creating SSE connection for user ${twitterId}`)

    // Create and return SSE response
    return sseManager.createSSEResponse(twitterId)
  } catch (err) {
    console.error('Error in SSE endpoint:', err)
    return error('Internal server error', 500)
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
