import { useState, useEffect } from 'react'
import { detectMobilePlatform } from '@/lib/utils/platformDetector'
import { useRouter } from 'next/navigation'

export function usePlatform() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const is = detectMobilePlatform()
    setIsMobile(!!is)
  }, [])

  return isMobile
}
