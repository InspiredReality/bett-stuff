import { useState } from 'react'
import { useNavigationStore } from '@/store/navigationStore'
import ForceGraph from '@/components/league-stuff/ForceGraph'

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

      <div className="-mx-10 mb-6 overflow-hidden bg-neutral-900">
        <ForceGraph />
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
