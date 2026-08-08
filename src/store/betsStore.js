import { create } from 'zustand'
import { betsService } from '@/services/api'

export const useBetsStore = create((set, get) => ({
  bets: [],
  isLoading: false,
  error: null,
  lastSyncedTimestamp: 0,

  // Computed getters
  getOpenBets: () => get().bets.filter(bet => bet.status === 'Open'),
  getLiveBets: () => get().bets.filter(bet => bet.status === 'Live'),
  getDoneBets: () => get().bets.filter(bet =>
    ['Decided', 'Expired', 'Cancelled'].includes(bet.status)
  ),

  // Actions
  fetchRecentBets: async () => {
    set({ isLoading: true, error: null })

    try {
      const response = await betsService.getRecentBets(get().lastSyncedTimestamp)
      set({
        bets: response,
        lastSyncedTimestamp: Date.now()
      })
      return true
    } catch (err) {
      set({ error: err.message })
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  createBet: async (betData) => {
    set({ isLoading: true, error: null })

    try {
      const response = await betsService.createBet(betData)
      await get().fetchRecentBets()
      return response
    } catch (err) {
      set({ error: err.message })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  callBet: async (betId, callAmount) => {
    set({ isLoading: true, error: null })

    try {
      const response = await betsService.callBet(betId, callAmount)
      await get().fetchRecentBets()
      return response
    } catch (err) {
      set({ error: err.message })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  updateBet: async (betId, updateData) => {
    set({ isLoading: true, error: null })

    try {
      const response = await betsService.updateBet(betId, updateData)
      await get().fetchRecentBets()
      return response
    } catch (err) {
      set({ error: err.message })
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  bandwagonBet: async (betId, betAmount) => {
    set({ isLoading: true, error: null })

    try {
      const response = await betsService.bandwagonBet(betId, betAmount)
      await get().fetchRecentBets()
      return response
    } catch (err) {
      set({ error: err.message })
      throw err
    } finally {
      set({ isLoading: false })
    }
  }
}))
