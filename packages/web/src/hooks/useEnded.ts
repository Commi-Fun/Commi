import { useState, useEffect } from 'react'

const useEnded = (endTime: Date | string | null | undefined) => {
  const [isEnded, setIsEnded] = useState(false)

  useEffect(() => {
    if (!endTime) {
      setIsEnded(false)
      return
    }

    const checkIfEnded = () => {
      const endDate = new Date(endTime)
      const now = new Date()
      setIsEnded(now >= endDate)
    }

    // Check immediately
    checkIfEnded()

    // Check every second
    const interval = setInterval(checkIfEnded, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  return isEnded
}

export { useEnded }
