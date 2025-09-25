<template>
  <div class="history-view">
    <h2>Betting History</h2>
    <div v-if="navigationStore.currentFilter" class="filter-info">
      Showing: {{ navigationStore.currentFilter }} History
    </div>
    
    <div class="history-controls">
      <select v-model="selectedPeriod" class="period-select">
        <option value="all">All Time</option>
        <option value="month">Last Month</option>
        <option value="week">Last Week</option>
        <option value="today">Today</option>
      </select>
      
      <select v-model="selectedType" class="type-select">
        <option value="all">All Types</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
    
    <div class="history-list">
      <div v-for="bet in filteredHistory" :key="bet.bet_id" class="history-item">
        <div class="history-header">
          <span class="bet-date">{{ formatDate(bet.decision_timestamp) }}</span>
          <span class="bet-status" :class="getStatusClass(bet.status)">
            {{ bet.status }}
          </span>
        </div>
        
        <div class="history-body">
          <div class="teams">
            {{ Object.keys(bet.blue_team)[0] }} vs {{ Object.keys(bet.red_team)[0] }}
          </div>
          <div class="bet-details">
            <span>Spread: {{ bet.spread }}</span>
            <span class="result" :class="getResultClass(bet)">
              {{ getResult(bet) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useBetsStore } from '@/stores/bets'
import { useUserStore } from '@/stores/user'

const navigationStore = useNavigationStore()
const betsStore = useBetsStore()
const userStore = useUserStore()

const selectedPeriod = ref('all')
const selectedType = ref('all')

const filteredHistory = computed(() => {
  let bets = betsStore.doneBets
  
  if (navigationStore.currentFilter === 'Me') {
    bets = bets.filter(bet => 
      bet.created_by === userStore.user?.login_email ||
      bet.decided_bets.some(db => 
        db.bettor === userStore.user?.login_email || 
        db.caller === userStore.user?.login_email
      )
    )
  }
  
  // Apply period filter
  if (selectedPeriod.value !== 'all') {
    // Filter logic based on period
  }
  
  // Apply type filter
  if (selectedType.value !== 'all') {
    // Filter logic based on type
  }
  
  return bets
})

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString()
}

function getStatusClass(status) {
  return status.toLowerCase()
}

function getResult(bet) {
  // Calculate win/loss amount
  return '+$50'
}

function getResultClass(bet) {
  return 'win' // or 'loss'
}
</script>

<style scoped>
.history-view {
  padding: 1rem;
}

.history-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.period-select,
.type-select {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  font-size: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.bet-date {
  color: #666;
  font-size: 0.9rem;
}

.bet-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.bet-status.decided {
  background: #e3f2fd;
  color: #1976d2;
}

.bet-status.expired {
  background: #fff3e0;
  color: #f57c00;
}

.bet-status.cancelled {
  background: #ffebee;
  color: #d32f2f;
}

.teams {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.bet-details {
  display: flex;
  justify-content: space-between;
  color: #666;
}

.result {
  font-weight: bold;
}

.result.win {
  color: #4caf50;
}

.result.loss {
  color: #f44336;
}
</style>