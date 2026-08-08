import { useState } from 'react'
import { useNavigationStore } from '@/store/navigationStore'

function StatsView() {
  const { currentFilter } = useNavigationStore()

  const [topPlayers] = useState([
    { id: 1, name: 'Player123', wins: 45, losses: 15, winRate: 75 },
    { id: 2, name: 'ProGambler', wins: 38, losses: 22, winRate: 63 },
    { id: 3, name: 'LuckyOne', wins: 52, losses: 9, winRate: 85 },
    { id: 4, name: 'BetMaster', wins: 41, losses: 19, winRate: 68 },
    { id: 5, name: 'RiskTaker', wins: 35, losses: 25, winRate: 58 }
  ])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">League Statistics</h2>
      {currentFilter && (
        <div className="p-2 bg-black/5 rounded-lg mb-4">
          Period: {currentFilter}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="mb-4 text-gray-800 font-semibold">Top Players</h3>
          <div className="flex flex-col gap-3">
            {topPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg transition-all hover:bg-gray-100 hover:translate-x-1"
              >
                <span className="w-8 font-bold text-gray-600">{index + 1}</span>
                <span className="flex-1 font-semibold text-gray-800">{player.name}</span>
                <span className="mr-4 text-gray-600 text-sm">
                  {player.wins}W - {player.losses}L
                </span>
                <span className="font-bold text-green-500">{player.winRate}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h4 className="mb-4 text-gray-800 font-semibold">Betting Volume</h4>
            <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
              Chart placeholder
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h4 className="mb-4 text-gray-800 font-semibold">Win Distribution</h4>
            <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
              Chart placeholder
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="mb-4 text-gray-800 font-semibold">Records</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4">
            <div
              className="text-white p-6 rounded-xl text-center flex flex-col gap-2"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <span className="text-3xl font-bold">$500</span>
              <span className="text-sm opacity-90">Biggest Win</span>
              <span className="text-sm opacity-80 italic">Player123</span>
            </div>
            <div
              className="text-white p-6 rounded-xl text-center flex flex-col gap-2"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <span className="text-3xl font-bold">12</span>
              <span className="text-sm opacity-90">Win Streak</span>
              <span className="text-sm opacity-80 italic">ProGambler</span>
            </div>
            <div
              className="text-white p-6 rounded-xl text-center flex flex-col gap-2"
              style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              <span className="text-3xl font-bold">85%</span>
              <span className="text-sm opacity-90">Best Win Rate</span>
              <span className="text-sm opacity-80 italic">LuckyOne</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsView
