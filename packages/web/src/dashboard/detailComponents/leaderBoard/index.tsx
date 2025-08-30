import { LeaderBoardTitle } from './LeaderBoardTitle'
import LeaderboardTable from '@/dashboard/components/LeaderboardTable'
import LeaderboardCards from './LeaderboardCards'
import { dummyLeaders } from '@/lib/constants'
import { useCampaign } from '@/query/query'

const LeaderBoards = ({ address }: { address: string | undefined }) => {
  const { data: campaign } = useCampaign(address || '')
  return (
    <div className="w-full flex flex-col pb-6">
      <LeaderBoardTitle />
      {dummyLeaders?.length > 0 ? (
        <div className="flex px-10 gap-6">
          <LeaderboardTable campaign={campaign} />
          <LeaderboardCards campaign={campaign} />
        </div>
      ) : (
        <div className="grow flex items-center justify-center font-extrabold text-gray-500 text-3xl">
          No joiner yet
        </div>
      )}
    </div>
  )
}

export default LeaderBoards
