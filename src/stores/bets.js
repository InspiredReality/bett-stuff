import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { betsService } from '@/services/bets'

export const useBetsStore = defineStore('bets', () => {
  const bets = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const lastSyncedTimestamp = ref(0)

  const openBets = computed(() => 
    bets.value.filter(bet => bet.status === 'Open')
  )
  
  const liveBets = computed(() => 
    bets.value.filter(bet => bet.status === 'Live')
  )
  
  const doneBets = computed(() => 
    bets.value.filter(bet => ['Decided', 'Expired', 'Cancelled'].includes(bet.status))
  )

  async function fetchRecentBets() {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await betsService.getRecentBets(lastSyncedTimestamp.value)
      bets.value = response
      lastSyncedTimestamp.value = Date.now()
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function createBet(betData) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await betsService.createBet(betData)
      await fetchRecentBets() // Refresh bets list
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function callBet(betId, callAmount) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await betsService.callBet(betId, callAmount)
      await fetchRecentBets() // Refresh bets list
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateBet(betId, updateData) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await betsService.updateBet(betId, updateData)
      await fetchRecentBets() // Refresh bets list
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    bets,
    isLoading,
    error,
    openBets,
    liveBets,
    doneBets,
    fetchRecentBets,
    createBet,
    callBet,
    updateBet
  }
})
