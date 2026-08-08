import { useEffect, useMemo } from 'react'
import { useNavigationStore } from '@/store/navigationStore'
import { useBetsStore } from '@/store/betsStore'
import { useUserStore } from '@/store/userStore'
import LoadingSpinner from '@/components/common/LoadingSpinner'

function LiveBetsView() {
  const { currentFilter } = useNavigationStore()
  const { isLoading, getLiveBets, fetchRecentBets } = useBetsStore()
  const { user } = useUserStore()

  const liveBets = getLiveBets()

  const filteredBets = useMemo(() => {
    if (currentFilter === 'Mine') {
      return liveBets.filter(bet =>
        bet.live_bets?.some(lb =>
          lb.bettor === user?.login_email ||
          lb.caller === user?.login_email
        )
      )
    }
    return liveBets
  }, [liveBets, currentFilter, user])

  const getUserPosition = (bet) => {
    const userEmail = user?.login_email
    const liveBet = bet.live_bets?.find(lb =>
      lb.bettor === userEmail || lb.caller === userEmail
    )
    if (!liveBet) return 'N/A'
    return liveBet.bettor === userEmail ? 'Blue Team' : 'Red Team'
  }

  const getUserAmount = (bet) => {
    const userEmail = user?.login_email
    const liveBet = bet.live_bets?.find(lb =>
      lb.bettor === userEmail || lb.caller === userEmail
    )
    return liveBet ? liveBet.bet_amount : 0
  }

  useEffect(() => {
    fetchRecentBets()
  }, [fetchRecentBets])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Live Bets</h2>
      {currentFilter && (
        <div className="p-2 bg-black/5 rounded-lg mb-4">
          Showing: {currentFilter}
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : filteredBets.length === 0 ? (
        <div className="text-center p-12 text-gray-400">
          <p>No live bets at the moment</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBets.map((bet) => (
            <div
              key={bet.bet_id}
              className="bg-white rounded-xl p-6 shadow-md relative border-2 border-green-500"
            >
              <div className="absolute top-4 right-4 flex items-center gap-2 text-green-500 font-bold text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                LIVE
              </div>

              <div className="flex items-center justify-between my-6 p-4 bg-gray-100 rounded-lg">
                <div className="flex flex-col items-center flex-1">
                  <span className="font-bold mb-2">{Object.keys(bet.blue_team || {})[0]}</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {Object.values(bet.blue_team || {})[0]}
                  </span>
                </div>
                <div className="px-4 text-gray-400 font-bold">VS</div>
                <div className="flex flex-col items-center flex-1">
                  <span className="font-bold mb-2">{Object.keys(bet.red_team || {})[0]}</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {Object.values(bet.red_team || {})[0]}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>Spread:</span>
                  <span>{bet.spread}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>Your Position:</span>
                  <span className="font-bold text-blue-500">{getUserPosition(bet)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Amount:</span>
                  <span>${getUserAmount(bet)}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="mb-3 text-gray-800 font-semibold">Participants</h4>
                <div className="flex flex-col gap-2">
                  {bet.live_bets?.map((liveBet, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between p-2 bg-white rounded text-sm"
                    >
                      <span>{liveBet.bettor} vs {liveBet.caller}</span>
                      <span>${liveBet.bet_amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LiveBetsView
