import { LeaderBoardTitle } from './LeaderBoardTitle'
import LeaderboardTable from '@/dashboard/components/LeaderboardTable'
import LeaderboardCards from './LeaderboardCards'
import { dummyLeaders } from '@/lib/constants'

const LeaderBoards = ({
  address,
  setStatus,
}: {
  address: string
  setStatus: (arf: string) => void
}) => {
  return (
    <div className="w-full flex flex-col pb-6">
      <LeaderBoardTitle setStatus={setStatus} />
      {dummyLeaders?.length > 0 ? (
        <div className="flex px-10 gap-6">
          <LeaderboardTable address={address} />
          <LeaderboardCards address={address} />
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
