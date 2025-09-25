<template>
  <div class="live-bets-view">
    <h2>Live Bets</h2>
    <div v-if="navigationStore.currentFilter" class="filter-info">
      Showing: {{ navigationStore.currentFilter }}
    </div>
    
    <div v-if="betsStore.isLoading" class="loading">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="!filteredBets.length" class="empty-state">
      <p>No live bets at the moment</p>
    </div>
    
    <div v-else class="bets-grid">
      <div v-for="bet in filteredBets" :key="bet.bet_id" class="live-bet-card">
        <div class="live-indicator">
          <span class="pulse"></span>
          LIVE
        </div>
        
        <div class="bet-matchup">
          <div class="team-section">
            <span class="team-name">{{ Object.keys(bet.blue_team)[0] }}</span>
            <span class="team-score">{{ Object.values(bet.blue_team)[0] }}</span>
          </div>
          <div class="vs">VS</div>
          <div class="team-section">
            <span class="team-name">{{ Object.keys(bet.red_team)[0] }}</span>
            <span class="team-score">{{ Object.values(bet.red_team)[0] }}</span>
          </div>
        </div>
        
        <div class="bet-info">
          <div class="info-row">
            <span>Spread:</span>
            <span>{{ bet.spread }}</span>
          </div>
          <div class="info-row">
            <span>Your Position:</span>
            <span class="position">{{ getUserPosition(bet) }}</span>
          </div>
          <div class="info-row">
            <span>Amount:</span>
            <span>${{ getUserAmount(bet) }}</span>
          </div>
        </div>
        
        <div class="bet-participants">
          <h4>Participants</h4>
          <div class="participants-list">
            <div v-for="liveBet in bet.live_bets" :key="liveBet.bettor + liveBet.caller" class="participant">
              <span>{{ liveBet.bettor }} vs {{ liveBet.caller }}</span>
              <span>${{ liveBet.bet_amount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useBetsStore } from '@/stores/bets'
import { useUserStore } from '@/stores/user'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const navigationStore = useNavigationStore()
const betsStore = useBetsStore()
const userStore = useUserStore()

const filteredBets = computed(() => {
  const filter = navigationStore.currentFilter
  if (filter === 'Mine') {
    return betsStore.liveBets.filter(bet => 
      bet.live_bets.some(lb => 
        lb.bettor === userStore.user?.login_email || 
        lb.caller === userStore.user?.login_email
      )
    )
  }
  return betsStore.liveBets
})

function getUserPosition(bet) {
  const userEmail = userStore.user?.login_email
  const liveBet = bet.live_bets.find(lb => 
    lb.bettor === userEmail || lb.caller === userEmail
  )
  if (!liveBet) return 'N/A'
  return liveBet.bettor === userEmail ? 'Blue Team' : 'Red Team'
}

function getUserAmount(bet) {
  const userEmail = userStore.user?.login_email
  const liveBet = bet.live_bets.find(lb => 
    lb.bettor === userEmail || lb.caller === userEmail
  )
  return liveBet ? liveBet.bet_amount : 0
}

onMounted(() => {
  betsStore.fetchRecentBets()
})
</script>

<style scoped>
.live-bets-view {
  padding: 1rem;
}

.filter-info {
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #999;
}

.bets-grid {
  display: grid;
  gap: 1rem;
}

.live-bet-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 2px solid #4caf50;
}

.live-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4caf50;
  font-weight: bold;
  font-size: 0.9rem;
}

.pulse {
  width: 8px;
  height: 8px;
  background: #4caf50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

.bet-matchup {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.5rem 0;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
}

.team-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.team-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.team-score {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.vs {
  padding: 0 1rem;
  color: #999;
  font-weight: bold;
}

.bet-info {
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.position {
  font-weight: bold;
  color: #2196f3;
}

.bet-participants {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.bet-participants h4 {
  margin-bottom: 0.75rem;
  color: #333;
}

.participants-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.participant {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>