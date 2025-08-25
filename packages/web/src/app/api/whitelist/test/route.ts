import { sseManager } from '@/lib/utils/sseManager'

export const GET = () => {
  sseManager.broadcastToUser('1813754530678583296', {
    type: 'whitelist_update',
    twitterId: '1813754530678583296',
    data: {
      referred: true,
      message: '小王小王你是谁',
    },
  })
}
