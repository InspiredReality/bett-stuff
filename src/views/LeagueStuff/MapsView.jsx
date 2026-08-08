import { useState } from 'react'
import { useNavigationStore } from '@/store/navigationStore'

function MapsView() {
  const { currentFilter } = useNavigationStore()

  const [regions] = useState([
    { name: 'North', totalBets: 145, activeUsers: 23, volume: 4500 },
    { name: 'South', totalBets: 98, activeUsers: 18, volume: 3200 },
    { name: 'East', totalBets: 176, activeUsers: 31, volume: 5800 },
    { name: 'West', totalBets: 134, activeUsers: 27, volume: 4100 }
  ])

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">League Maps</h2>
      {currentFilter && (
        <div className="p-2 bg-black/5 rounded-lg mb-4">
          Year: {currentFilter}
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-md mb-6">
        <div
          className="h-[300px] rounded-lg flex flex-col items-center justify-center text-white mb-6"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          <p className="text-lg">Interactive betting heat map</p>
          <p className="text-sm opacity-80">Shows geographical distribution of bets</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="mb-4 text-gray-800 font-semibold">Activity Level</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded bg-red-600"></span>
              <span>High Activity</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded bg-orange-400"></span>
              <span>Medium Activity</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded bg-green-400"></span>
              <span>Low Activity</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="mb-4 text-gray-800 font-semibold">Regional Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          {regions.map((region) => (
            <div key={region.name} className="p-4 bg-gray-50 rounded-lg">
              <h4 className="mb-3 text-gray-800 font-semibold">{region.name}</h4>
              <div className="flex justify-between py-1 text-sm">
                <span>Total Bets:</span>
                <span>{region.totalBets}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span>Active Users:</span>
                <span>{region.activeUsers}</span>
              </div>
              <div className="flex justify-between py-1 text-sm">
                <span>Volume:</span>
                <span>${region.volume}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MapsView
