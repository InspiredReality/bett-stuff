<template>
  <div class="stats-view">
    <h2>League Statistics</h2>
    <div v-if="navigationStore.currentFilter" class="filter-info">
      Period: {{ navigationStore.currentFilter }}
    </div>
    
    <div class="stats-container">
      <div class="leaderboard">
        <h3>Top Players</h3>
        <div class="leaderboard-list">
          <div v-for="(player, index) in topPlayers" :key="player.id" class="player-row">
            <span class="rank">{{ index + 1 }}</span>
            <span class="player-name">{{ player.name }}</span>
            <span class="player-stat">{{ player.wins }}W - {{ player.losses }}L</span>
            <span class="player-winrate">{{ player.winRate }}%</span>
          </div>
        </div>
      </div>
      
      <div class="charts-section">
        <div class="chart-card">
          <h4>Betting Volume</h4>
          <div class="chart-placeholder">
            <!-- Chart component would go here -->
            <canvas ref="volumeChart"></canvas>
          </div>
        </div>
        
        <div class="chart-card">
          <h4>Win Distribution</h4>
          <div class="chart-placeholder">
            <!-- Chart component would go here -->
            <canvas ref="distributionChart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="records-section">
        <h3>Records</h3>
        <div class="records-grid">
          <div class="record-card">
            <span class="record-value">$500</span>
            <span class="record-label">Biggest Win</span>
            <span class="record-holder">Player123</span>
          </div>
          <div class="record-card">
            <span class="record-value">12</span>
            <span class="record-label">Win Streak</span>
            <span class="record-holder">ProGambler</span>
          </div>
          <div class="record-card">
            <span class="record-value">85%</span>
            <span class="record-label">Best Win Rate</span>
            <span class="record-holder">LuckyOne</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNavigationStore } from '@/stores/navigation'

const navigationStore = useNavigationStore()

const topPlayers = ref([
  { id: 1, name: 'Player123', wins: 45, losses: 15, winRate: 75 },
  { id: 2, name: 'ProGambler', wins: 38, losses: 22, winRate: 63 },
  { id: 3, name: 'LuckyOne', wins: 52, losses: 9, winRate: 85 },
  { id: 4, name: 'BetMaster', wins: 41, losses: 19, winRate: 68 },
  { id: 5, name: 'RiskTaker', wins: 35, losses: 25, winRate: 58 }
])

onMounted(() => {
  // Initialize charts here
})
</script>

<style scoped>
.stats-view {
  padding: 1rem;
}

.filter-info {
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.stats-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.leaderboard {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.leaderboard h3 {
  margin-bottom: 1rem;
  color: #333;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.player-row {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 8px;
  transition: all 0.2s;
}

.player-row:hover {
  background: #f0f0f0;
  transform: translateX(4px);
}

.rank {
  width: 30px;
  font-weight: bold;
  color: #666;
}

.player-name {
  flex: 1;
  font-weight: 600;
  color: #333;
}

.player-stat {
  margin-right: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.player-winrate {
  font-weight: bold;
  color: #4caf50;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr 1fr;
  }
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-card h4 {
  margin-bottom: 1rem;
  color: #333;
}

.chart-placeholder {
  height: 200px;
  background: #f9f9f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.records-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.records-section h3 {
  margin-bottom: 1rem;
  color: #333;
}

.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.record-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.record-value {
  font-size: 1.8rem;
  font-weight: bold;
}

.record-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.record-holder {
  font-size: 0.85rem;
  opacity: 0.8;
  font-style: italic;
}
</style>