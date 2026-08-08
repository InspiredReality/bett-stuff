import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

export default api

// Auth service
export const authService = {
  async login(credentials) {
    return api.post('/login', credentials)
  },

  async changePassword(data) {
    return api.post('/change_password', data)
  }
}

// Bets service
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
