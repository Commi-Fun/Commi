import { GlobalContext } from '@/context/GlobalContext'
import { dummyLeaders } from '@/lib/constants'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { useContext } from 'react'

interface LeaderboardCardData {
  rank: number
  username: string
  handle: string
  score: string
  percentage: string
  rewards: string
  avatar?: string
  color: 'green' | 'red' | 'gray'
}

interface LeaderboardCardsProps {
  cards?: LeaderboardCardData[]
}

const dummyCards: any[] = [
  {
    rank: 1,
    username: 'CryptoKing',
    handle: '@TheRealKing',
    score: '1,250,000',
    percentage: '+15.2%',
    rewards: '10,000 COM',
    color: 'green',
    colSpan: 5,
    rowSpan: 5,
  },
  {
    rank: 2,
    username: 'DiamondHands',
    handle: '@HODLMaster',
    score: '1,100,500',
    percentage: '+8.5%',
    rewards: '5,000 COM',
    color: 'green',
    colSpan: 4,
    rowSpan: 5,
  },
  // {
  //   rank: 3,
  //   username: 'Satoshi Jr.',
  //   handle: '@BitcoinKid',
  //   score: '980,000',
  //   percentage: '+5.0%',
  //   rewards: '2,500 COM',
  //   color: 'green',
  //   colSpan: 3,
  //   rowSpan: 5,
  // },
]

const Card = (props: any) => {
  return (
    <div className={`flex flex-col p-4 relative w-full h-full overflow-hidden`}>
      <div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>

        <div className="flex gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex shrink-0 items-center justify-center border-2 overflow-hidden border-white/30">
            <img width={40} height={40} alt="" src={props.imgUrl} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-black flex gap-1 items-center">
              <span className="font-bold">{props.name}</span>
              <span className="font-medium text-xs">@{props.handle}</span>
            </div>
            <div className="flex items-center gap-4">
              <p className="bg-blue-500 rounded w-fit px-1 py-[0.5px] font-bold text-xs">Airdrop</p>
              <span className="font-bold text-black">{props.airdrop}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-right">
        {props.rank === 1 && <p className="text-3xl text-amber-200 font-extrabold">1st</p>}
        {props.rank === 2 && <p className="text-3xl font-extrabold">2nd</p>}
        {props.rank === 3 && <p className="text-3xl text-orange-100 font-extrabold">3rd</p>}

        <div className="text-xs opacity-80">Rewards</div>
        <div className="text-lg font-semibold">{props.rewards}</div>
      </div>
    </div>
  )
}

const LeaderboardCards = ({ cards = dummyCards }: any) => {
  const params = useParams()
  const address = params.address as string
  const { campaigns } = useContext(GlobalContext)

  const targetLeaders = dummyLeaders

  const getCardColor = (color: 'green' | 'red' | 'gray') => {
    switch (color) {
      case 'green':
        return 'from-green-400 to-green-600'
      case 'red':
        return 'from-red-400 to-red-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '1st'
    if (rank === 2) return '2nd'
    if (rank === 3) return '3rd'
    return `${rank}th`
  }

  const getCardSize = (rank: number) => {
    if (rank === 1) return 'col-span-2 row-span-5'
    if (rank >= 2 && rank <= 5) return 'col-span-1 row-span-1'
    return 'col-span-1 row-span-1'
  }

  return (
    <div className="grow grid grid-cols-12 grid-rows-12 gap-2 min-h-100">
      <div className="col-span-5 row-span-5 bg-green-400 border-2xl border-green-500  rounded-2xl">
        <Card {...targetLeaders[0]} />
      </div>
      <div className="col-span-4 row-span-5 bg-red-400 border-2xl border-red-500  rounded-2xl">
        {targetLeaders[1] && <Card {...targetLeaders[1]} />}
      </div>
      <div className="col-span-3 row-span-5 bg-green-400 border-2xl border-green-500  rounded-2xl">
        {targetLeaders[2] && <Card {...targetLeaders[2]} />}
      </div>
      <div className="col-span-4 row-span-5 bg-green-400 border-2xl border-green-500  rounded-2xl">
        {targetLeaders[3] && <Card {...targetLeaders[3]} />}
      </div>
      <div className="col-span-4 row-span-5 bg-red-400 border-2xl border-red-500  rounded-2xl">
        {targetLeaders[4] && <Card {...targetLeaders[4]} />}
      </div>
      <div className="col-span-4 row-span-5 bg-green-400 border-2xl border-green-500  rounded-2xl">
        {targetLeaders[5] && <Card {...targetLeaders[5]} />}
      </div>
      <div className="col-span-3 row-span-5 bg-green-400 border-2xl border-green-500  rounded-2xl">
        {targetLeaders[6] && <Card {...targetLeaders[6]} />}
      </div>
      <div className="col-span-3 row-span-5 bg-red-400 border-2xl border-red-500  rounded-2xl">
        {targetLeaders[7] && <Card {...targetLeaders[7]} />}
      </div>
      <div className="col-span-3 row-span-5 bg-green-400 border-2xl border-green-500  rounded-2xl">
        {targetLeaders[8] && <Card {...targetLeaders[8]} />}
      </div>
      <div className="col-span-3 row-span-5 bg-green-400 border-2xl border-green-500  rounded-2xl">
        {targetLeaders[9] && <Card {...targetLeaders[9]} />}
      </div>
    </div>
  )
}

export default LeaderboardCards
