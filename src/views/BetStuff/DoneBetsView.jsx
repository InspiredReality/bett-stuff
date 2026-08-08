import { useMemo } from 'react'
import { useNavigationStore } from '@/store/navigationStore'
import { useBetsStore } from '@/store/betsStore'
import { useUserStore } from '@/store/userStore'

function DoneBetsView() {
  const { currentFilter } = useNavigationStore()
  const { getDoneBets } = useBetsStore()
  const { user } = useUserStore()

  const doneBets = getDoneBets()

  const filteredBets = useMemo(() => {
    if (currentFilter === 'Mine') {
      return doneBets.filter(bet =>
        bet.created_by === user?.login_email ||
        [...(bet.decided_bets || []), ...(bet.expired_bets || []), ...(bet.cancelled_bets || [])].some(b =>
          b.bettor === user?.login_email ||
          b.caller === user?.login_email
        )
      )
    }
    return doneBets
  }, [doneBets, currentFilter, user])

  const totalCompleted = filteredBets.length
  const decidedCount = filteredBets.filter(b => b.status === 'Decided').length
  const expiredCount = filteredBets.filter(b => b.status === 'Expired').length

  const getWinner = (bet) => {
    return Object.keys(bet.blue_team || {})[0]
  }

  const getPayout = (bet) => {
    return 100
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'decided':
        return 'bg-green-100 text-green-700'
      case 'expired':
        return 'bg-orange-100 text-orange-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Completed Bets</h2>
      {currentFilter && (
        <div className="p-2 bg-black/5 rounded-lg mb-4">
          Showing: {currentFilter}
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-xl text-center shadow-md">
          <span className="block text-3xl font-bold text-gray-800">{totalCompleted}</span>
          <span className="block text-sm text-gray-600 mt-2">Total Completed</span>
        </div>
        <div className="bg-white p-6 rounded-xl text-center shadow-md">
          <span className="block text-3xl font-bold text-gray-800">{decidedCount}</span>
          <span className="block text-sm text-gray-600 mt-2">Decided</span>
        </div>
        <div className="bg-white p-6 rounded-xl text-center shadow-md">
          <span className="block text-3xl font-bold text-gray-800">{expiredCount}</span>
          <span className="block text-sm text-gray-600 mt-2">Expired</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filteredBets.map((bet) => (
          <div key={bet.bet_id} className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">#{bet.bet_id}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusClass(bet.status)}`}>
                {bet.status}
              </span>
            </div>

            <div className="flex items-center gap-4 font-semibold mb-4">
              <span>{Object.keys(bet.blue_team || {})[0]}</span>
              <span className="text-gray-400 text-sm">vs</span>
              <span>{Object.keys(bet.red_team || {})[0]}</span>
            </div>

            {bet.status === 'Decided' && (
              <div className="flex justify-between p-4 bg-gray-100 rounded-lg mb-4">
                <span className="font-semibold text-green-500">Winner: {getWinner(bet)}</span>
                <span className="font-semibold text-gray-800">Payout: ${getPayout(bet)}</span>
              </div>
            )}

            <div className="text-sm text-gray-600">
              Completed: {formatDate(bet.decision_timestamp || bet.expiration_timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoneBetsView
