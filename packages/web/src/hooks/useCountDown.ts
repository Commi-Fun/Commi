// src/hooks/useCountdown.js

import { useState, useEffect } from 'react'

const useCountdown = (targetDate: Date) => {
  const countDownDate = new Date(targetDate).getTime()

  // state 中存储的是剩余时间的毫秒数
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime())

  useEffect(() => {
    const interval = setInterval(() => {
      const countDown = targetDate.getTime() - new Date().getTime()
      setCountDown(countDown)
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [targetDate]) // 依赖项是目标时间

  // 将毫秒数转换为天、小时、分钟和秒
  return formatDuration(countDown)
}

function formatDuration(ms: number) {
  // 1. 处理无效输入或负数
  if (ms < 0 || typeof ms !== 'number') {
    return '00:00'
  }

  // 2. 将总毫秒数转换为总秒数
  const totalSeconds = Math.floor(ms / 1000)

  // 3. 计算分钟数
  const minutes = Math.floor(totalSeconds / 60)

  // 4. 计算剩余的秒数
  const seconds = totalSeconds % 60

  // 5. 使用 padStart 补零，确保数字是两位数
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}

export { useCountdown }
