export type MobilePlatform = 'line' | 'wechat' | 'telegram' | 'browser' | ''

export function detectMobilePlatform(userAgent?: string): MobilePlatform {
  const ua = userAgent || (typeof window !== 'undefined' ? window.navigator.userAgent : '')

  // 检测是否为移动设备
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)

  if (!isMobile) {
    return ''
  }

  // 检测 LINE
  if (/Line/i.test(ua)) {
    return 'line'
  }

  // 检测微信 (WeChat)
  if (/MicroMessenger/i.test(ua)) {
    return 'wechat'
  }

  // 检测 Telegram WebApp (主要检测方式)
  if (typeof window !== 'undefined') {
    if ((window as any).Telegram || (window as any).TelegramWebview) {
      return 'telegram'
    }
  }

  return ''
}
