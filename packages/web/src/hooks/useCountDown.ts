// src/hooks/useCountdown.js

import { useState, useEffect } from 'react'

const useCountdown = (targetDate: Date) => {
  const countDownDate = new Date(targetDate).getTime()

  // state 中存储的是剩余时间的毫秒数
  const [countDown, setCountDown] = useState(countDownDate - new Date().getTime())

  useEffect(() => {
    // 每秒执行一次的 interval
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime())
    }, 1000)

    // 清理函数，在组件卸载时清除 interval
    return () => clearInterval(interval)
  }, [countDownDate]) // 依赖项是目标时间

  // 将毫秒数转换为天、小时、分钟和秒
  return getReturnValues(countDown)
}

// 将剩余时间（毫秒）转换为易于阅读的格式
const getReturnValues = (countDown: number) => {
  // 计算天、小时、分钟、秒
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24))
  const hours = Math.floor((countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000)

  // 如果倒计时结束，所有值都应为0
  if (countDown < 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return { days, hours, minutes, seconds }
}

export { useCountdown }
