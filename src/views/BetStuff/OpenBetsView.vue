<template>
  <div class="open-bets-view">
    <h2>Open Bets</h2>
    <div v-if="navigationStore.currentFilter" class="filter-info">
      Showing: {{ navigationStore.currentFilter }}
    </div>
    
    <div v-if="betsStore.isLoading" class="loading">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="betsStore.error" class="error">
      <ErrorMessage :message="betsStore.error" />
    </div>
    
    <div v-else class="bets-list">
      <div v-for="bet in filteredBets" :key="bet.bet_id" class="bet-card">
        <div class="bet-header">
          <span class="bet-id">#{{ bet.bet_id }}</span>
          <span class="bet-status">{{ bet.status }}</span>
        </div>
        <div class="bet-teams">
          <div class="team blue">{{ Object.keys(bet.blue_team)[0] }}</div>
          <div class="spread">{{ bet.spread }}</div>
          <div class="team red">{{ Object.keys(bet.red_team)[0] }}</div>
        </div>
        <div class="bet-footer">
          <button @click="callBet(bet.bet_id)" class="call-btn">Call Bet</button>
          <button @click="bandwagon(bet.bet_id)" class="bandwagon-btn">Bandwagon</button>
        </div>
      </div>
    </div>
    
    <button @click="showCreateBet = true" class="fab">+</button>
    
    <!-- Create Bet Modal -->
    <div v-if="showCreateBet" class="modal">
      <!-- Modal content here -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useBetsStore } from '@/stores/bets'
import { useUserStore } from '@/stores/user'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const navigationStore = useNavigationStore()
const betsStore = useBetsStore()
const userStore = useUserStore()

const showCreateBet = ref(false)

const filteredBets = computed(() => {
  const filter = navigationStore.currentFilter
  if (filter === 'Mine') {
    return betsStore.openBets.filter(bet => 
      bet.created_by === userStore.user?.login_email ||
      bet.open_bets.some(b => b.bettor === userStore.user?.login_email)
    )
  }
  return betsStore.openBets
})

async function callBet(betId) {
  // Implementation
}

async function bandwagon(betId) {
  // Implementation
}

onMounted(() => {
  betsStore.fetchRecentBets()
})
</script>

<style scoped>
.open-bets-view {
  padding: 1rem;
}

.filter-info {
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.bets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bet-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.bet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bet-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.bet-teams {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
}

.team {
  flex: 1;
  text-align: center;
  font-weight: bold;
}

.spread {
  padding: 0.25rem 0.5rem;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

.bet-footer {
  display: flex;
  gap: 0.5rem;
}

.call-btn, .bandwagon-btn {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.call-btn {
  background: #4CAF50;
  color: white;
}

.bandwagon-btn {
  background: #2196F3;
  color: white;
}

.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #808080;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s;
}

.fab:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}
</style>
