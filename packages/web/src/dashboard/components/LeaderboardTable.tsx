import { dummyLeaders } from '@/lib/constants'
import React, { useState } from 'react'

interface LeaderboardEntry {
  rank: number
  twitterHandle: string
  airdrop: string
  score: number
  change: 'up' | 'down' | 'same'
}

interface LeaderboardTableProps {
  entries?: LeaderboardEntry[]
}

const LeaderboardTable = ({ address }: { address: string }) => {
  const [activeTab, setActiveTab] = useState<'total' | 'last30min'>('total')

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* Tabs */}
      <div className="flex justify-end">
        <button
          onClick={() => setActiveTab('total')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'total'
              ? 'border-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}>
          Total
        </button>
        <button
          onClick={() => setActiveTab('last30min')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'last30min'
              ? 'border-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}>
          Last 30 min
        </button>
      </div>

      {/* Table with Blue Theme */}
      <div className="overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* Table Header */}
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-4 px-6 text-center font-semibold rounded-tl-2xl">Rank</th>
                <th className="py-4 px-6 text-center font-semibold">Twitter Handle</th>
                <th className="py-4 px-6 text-center font-semibold">Airdrop (Token)</th>
                <th className="py-4 px-6 text-center font-semibold rounded-tr-2xl">Score</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {dummyLeaders?.length > 0 &&
                dummyLeaders.map((item: any, index: number) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? 'bg-blue-100' : 'bg-white'
                    } hover:bg-blue-50 transition-colors`}>
                    <td className="py-4 px-6 text-center font-medium text-gray-900">{item.rank}</td>
                    <td className="py-4 px-6 text-center text-gray-900">{item.handle}</td>
                    <td className="py-4 px-6 text-center text-gray-900">{item.airdrop}</td>
                    <td className="py-4 px-6 text-center text-gray-900">
                      <div className="flex items-center justify-center gap-2">
                        <span>{item.score}</span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardTable
