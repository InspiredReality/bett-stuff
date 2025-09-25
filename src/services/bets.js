import api from './api'

export const betsService = {
  async getRecentBets(lastSyncedTimestamp) {
    return api.get('/get_recent_bets', {
      params: { last_synced_timestamp: lastSyncedTimestamp }
    })
  },
  
  async createBet(betData) {
    return api.post('/create_bet', betData)
  },
  
  async callBet(betId, callAmount) {
    return api.post('/call_bet', { 
      bet_id: betId, 
      call_amount: callAmount 
    })
  },
  
  async updateBet(betId, updateData) {
    return api.post('/update_bet', {
      bet_id: betId,
      ...updateData
    })
  },
  
  async bandwagonBet(betId, betAmount) {
    return api.post('/bandwagon_bet', {
      bet_id: betId,
      bet_amount: betAmount
    })
  },
  
  async getBet(betId) {
    return api.get('/get_bet', {
      params: { bet_id: betId }
    })
  }
}
