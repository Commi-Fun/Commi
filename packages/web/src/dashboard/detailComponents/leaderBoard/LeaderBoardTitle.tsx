import { AlarmIcon } from '@/components/icons/AlarmIcon'
import RedoIcon from '@/components/icons/RedoIcon'
import { SpinningRefresh } from '@/components/SpinningRefresh'
import { useCountdown } from '@/hooks/useCountDown'
import dayjs from 'dayjs'
import { useState } from 'react'

export const LeaderBoardTitle = ({ setStatus }: { setStatus: (a: string) => void }) => {
  const a = useCountdown(dayjs().add(30, 'minutes').toDate())
  const [refreshing, setRefreshing] = useState(false)

  const onRefreshClick = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      setStatus('claimable')
    }, 1000)
  }

  return (
    <div className="w-full flex justify-between items-center px-10 py-4">
      <p className="text-[2rem] font-extrabold">Leaderboards</p>

      <div className="flex items-center font-bold gap-1">
        <span className="">Next round in</span>
        <AlarmIcon className="text-black" />
        <span>00:12</span>
        <div className="w-[1px] h-3 bg-gray-600 rounded-full mx-2"></div>
        <p className="text-gray-600 font-medium">Auto refresh every 1 min</p>
        <div onClick={onRefreshClick} className="flex items-center gap-[2.5px] pl-6 cursor-pointer">
          {refreshing ? <SpinningRefresh /> : <RedoIcon className="text-blue-500 text-[20px]" />}

          <span className="text-blue-500">Refresh</span>
        </div>
      </div>
    </div>
  )
}
