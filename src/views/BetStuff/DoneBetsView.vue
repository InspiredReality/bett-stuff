<template>
  <div class="done-bets-view">
    <h2>Completed Bets</h2>
    <div v-if="navigationStore.currentFilter" class="filter-info">
      Showing: {{ navigationStore.currentFilter }}
    </div>
    
    <div class="summary-cards">
      <div class="summary-card">
        <span class="number">{{ totalCompleted }}</span>
        <span class="label">Total Completed</span>
      </div>
      <div class="summary-card">
        <span class="number">{{ decidedCount }}</span>
        <span class="label">Decided</span>
      </div>
      <div class="summary-card">
        <span class="number">{{ expiredCount }}</span>
        <span class="label">Expired</span>
      </div>
    </div>
    
    <div class="done-bets-list">
      <div v-for="bet in filteredBets" :key="bet.bet_id" class="done-bet-card">
        <div class="bet-header">
          <span class="bet-id">#{{ bet.bet_id }}</span>
          <span class="bet-status" :class="bet.status.toLowerCase()">
            {{ bet.status }}
          </span>
        </div>
        
        <div class="bet-content">
          <div class="teams">
            <span>{{ Object.keys(bet.blue_team)[0] }}</span>
            <span class="vs">vs</span>
            <span>{{ Object.keys(bet.red_team)[0] }}</span>
          </div>
          
          <div class="bet-result" v-if="bet.status === 'Decided'">
            <span class="winner">Winner: {{ getWinner(bet) }}</span>
            <span class="payout">Payout: ${{ getPayout(bet) }}</span>
          </div>
          
          <div class="completion-date">
            Completed: {{ formatDate(bet.decision_timestamp || bet.expiration_timestamp) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useBetsStore } from '@/stores/bets'
import { useUserStore } from '@/stores/user'

const navigationStore = useNavigationStore()
const betsStore = useBetsStore()
const userStore = useUserStore()

const filteredBets = computed(() => {
  const filter = navigationStore.currentFilter
  if (filter === 'Mine') {
    return betsStore.doneBets.filter(bet => 
      bet.created_by === userStore.user?.login_email ||
      [...bet.decided_bets, ...bet.expired_bets, ...bet.cancelled_bets].some(b => 
        b.bettor === userStore.user?.login_email || 
        b.caller === userStore.user?.login_email
      )
    )
  }
  return betsStore.doneBets
})

const totalCompleted = computed(() => filteredBets.value.length)
const decidedCount = computed(() => 
  filteredBets.value.filter(b => b.status === 'Decided').length
)
const expiredCount = computed(() => 
  filteredBets.value.filter(b => b.status === 'Expired').length
)

function getWinner(bet) {
  // Determine winner logic
  return Object.keys(bet.blue_team)[0]
}

function getPayout(bet) {
  // Calculate payout
  return 100
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString()
}
</script>

<style scoped>
.done-bets-view {
  padding: 1rem;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-card .number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

.summary-card .label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}

.done-bets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.done-bet-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.bet-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.bet-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.bet-status.decided {
  background: #e8f5e9;
  color: #2e7d32;
}

.bet-status.expired {
  background: #fff3e0;
  color: #ef6c00;
}

.bet-status.cancelled {
  background: #ffebee;
  color: #c62828;
}

.teams {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.vs {
  color: #999;
  font-size: 0.9rem;
}

.bet-result {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.winner {
  font-weight: 600;
  color: #4caf50;
}

.payout {
  font-weight: 600;
  color: #333;
}

.completion-date {
  font-size: 0.9rem;
  color: #666;
}
</style>