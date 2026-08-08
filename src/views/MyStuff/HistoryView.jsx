import { useState, useMemo } from 'react'
import { useNavigationStore } from '@/store/navigationStore'
import { useBetsStore } from '@/store/betsStore'
import { useUserStore } from '@/store/userStore'

function HistoryView() {
  const { currentFilter } = useNavigationStore()
  const { getDoneBets } = useBetsStore()
  const { user } = useUserStore()

  const [selectedPeriod, setSelectedPeriod] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  const doneBets = getDoneBets()

  const filteredHistory = useMemo(() => {
    let bets = doneBets

    if (currentFilter === 'Me') {
      bets = bets.filter(bet =>
        bet.created_by === user?.login_email ||
        bet.decided_bets?.some(db =>
          db.bettor === user?.login_email ||
          db.caller === user?.login_email
        )
      )
    }

    // Apply period and type filters here if needed

    return bets
  }, [doneBets, currentFilter, user, selectedPeriod, selectedType])

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'decided':
        return 'bg-blue-100 text-blue-700'
      case 'expired':
        return 'bg-orange-100 text-orange-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getResult = (bet) => {
    return '+$50'
  }

  const getResultClass = (bet) => {
    return 'text-green-500'
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Betting History</h2>
      {currentFilter && (
        <div className="p-2 bg-black/5 rounded-lg mb-4">
          Showing: {currentFilter} History
        </div>
      )}

      <div className="flex gap-4 mb-6">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="flex-1 p-3 border border-gray-200 rounded-lg bg-white text-base"
        >
          <option value="all">All Time</option>
          <option value="month">Last Month</option>
          <option value="week">Last Week</option>
          <option value="today">Today</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="flex-1 p-3 border border-gray-200 rounded-lg bg-white text-base"
        >
          <option value="all">All Types</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {filteredHistory.map((bet) => (
          <div key={bet.bet_id} className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600 text-sm">{formatDate(bet.decision_timestamp)}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(bet.status)}`}>
                {bet.status}
              </span>
            </div>

            <div className="font-semibold mb-2">
              {Object.keys(bet.blue_team || {})[0]} vs {Object.keys(bet.red_team || {})[0]}
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Spread: {bet.spread}</span>
              <span className={`font-bold ${getResultClass(bet)}`}>
                {getResult(bet)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HistoryView
