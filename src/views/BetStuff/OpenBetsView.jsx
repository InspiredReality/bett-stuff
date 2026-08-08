import { useState, useEffect, useMemo } from 'react'
import { useNavigationStore } from '@/store/navigationStore'
import { useBetsStore } from '@/store/betsStore'
import { useUserStore } from '@/store/userStore'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorMessage from '@/components/common/ErrorMessage'

function OpenBetsView() {
  const { currentFilter } = useNavigationStore()
  const { isLoading, error, getOpenBets, fetchRecentBets, callBet: callBetAction } = useBetsStore()
  const { user } = useUserStore()
  const [showCreateBet, setShowCreateBet] = useState(false)

  const openBets = getOpenBets()

  const filteredBets = useMemo(() => {
    if (currentFilter === 'Mine') {
      return openBets.filter(bet =>
        bet.created_by === user?.login_email ||
        bet.open_bets?.some(b => b.bettor === user?.login_email)
      )
    }
    return openBets
  }, [openBets, currentFilter, user])

  const handleCallBet = async (betId) => {
    // Implementation
  }

  const handleBandwagon = async (betId) => {
    // Implementation
  }

  useEffect(() => {
    fetchRecentBets()
  }, [fetchRecentBets])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Open Bets</h2>
      {currentFilter && (
        <div className="p-2 bg-black/5 rounded-lg mb-4">
          Showing: {currentFilter}
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredBets.map((bet) => (
            <div
              key={bet.bet_id}
              className="bg-white rounded-xl p-4 shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">#{bet.bet_id}</span>
                <span className="text-gray-800 font-medium">{bet.status}</span>
              </div>
              <div className="flex items-center justify-between my-4">
                <div className="flex-1 text-center font-bold text-blue-600">
                  {Object.keys(bet.blue_team || {})[0]}
                </div>
                <div className="px-2 py-1 bg-black/10 rounded">
                  {bet.spread}
                </div>
                <div className="flex-1 text-center font-bold text-red-600">
                  {Object.keys(bet.red_team || {})[0]}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCallBet(bet.bet_id)}
                  className="flex-1 py-2 bg-green-500 text-white rounded-lg border-none cursor-pointer transition-colors hover:bg-green-600"
                >
                  Call Bet
                </button>
                <button
                  onClick={() => handleBandwagon(bet.bet_id)}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg border-none cursor-pointer transition-colors hover:bg-blue-600"
                >
                  Bandwagon
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => setShowCreateBet(true)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-gray-500 text-white border-none text-2xl cursor-pointer shadow-lg transition-transform hover:scale-110"
      >
        +
      </button>
    </div>
  )
}

export default OpenBetsView
