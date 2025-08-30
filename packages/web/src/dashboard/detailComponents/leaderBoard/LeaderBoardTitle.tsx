import { AlarmIcon } from '@/components/icons/AlarmIcon'
import RedoIcon from '@/components/icons/RedoIcon'
import { SpinningRefresh } from '@/components/SpinningRefresh'
import { useCountdown } from '@/hooks/useCountDown'
import { useCampaign } from '@/query/query'
import dayjs from 'dayjs'
import { useParams } from 'next/navigation'
import { useMemo, useState } from 'react'

export const LeaderBoardTitle = () => {
  const targetDate = useMemo(() => dayjs().add(30, 'minutes').toDate(), [])
  const remainingTime = useCountdown(targetDate)
  const params = useParams()
  const address = useMemo(() => params.address as string, [params.address])
  const { refetch } = useCampaign(address)
  const [refreshing, setRefreshing] = useState(false)

  const onRefreshClick = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (
    <div className="w-full flex justify-between items-center px-10 py-4">
      <p className="text-[2rem] font-extrabold">Leaderboards</p>

      <div className="flex items-center font-bold gap-1">
        <span className="">Next round in</span>
        <AlarmIcon className="text-black" />
        <span>{remainingTime}</span>
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
