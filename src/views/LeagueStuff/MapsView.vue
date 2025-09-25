<template>
  <div class="maps-view">
    <h2>League Maps</h2>
    <div v-if="navigationStore.currentFilter" class="filter-info">
      Year: {{ navigationStore.currentFilter }}
    </div>
    
    <div class="map-container">
      <div class="map-placeholder">
        <!-- Interactive map would go here -->
        <p>Interactive betting heat map</p>
        <p>Shows geographical distribution of bets</p>
      </div>
      
      <div class="map-legend">
        <h3>Activity Level</h3>
        <div class="legend-item">
          <span class="legend-color high"></span>
          <span>High Activity</span>
        </div>
        <div class="legend-item">
          <span class="legend-color medium"></span>
          <span>Medium Activity</span>
        </div>
        <div class="legend-item">
          <span class="legend-color low"></span>
          <span>Low Activity</span>
        </div>
      </div>
    </div>
    
    <div class="region-stats">
      <h3>Regional Statistics</h3>
      <div class="region-grid">
        <div v-for="region in regions" :key="region.name" class="region-card">
          <h4>{{ region.name }}</h4>
          <div class="region-stat">
            <span>Total Bets:</span>
            <span>{{ region.totalBets }}</span>
          </div>
          <div class="region-stat">
            <span>Active Users:</span>
            <span>{{ region.activeUsers }}</span>
          </div>
          <div class="region-stat">
            <span>Volume:</span>
            <span>${{ region.volume }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNavigationStore } from '@/stores/navigation'

const navigationStore = useNavigationStore()

const regions = ref([
  { name: 'North', totalBets: 145, activeUsers: 23, volume: 4500 },
  { name: 'South', totalBets: 98, activeUsers: 18, volume: 3200 },
  { name: 'East', totalBets: 176, activeUsers: 31, volume: 5800 },
  { name: 'West', totalBets: 134, activeUsers: 27, volume: 4100 }
])
</script>

<style scoped>
.maps-view {
  padding: 1rem;
}

.map-container {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.map-placeholder {
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 1.5rem;
}

.map-legend {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.map-legend h3 {
  margin-bottom: 1rem;
  color: #333;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.legend-color {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.legend-color.high {
  background: #d32f2f;
}

.legend-color.medium {
  background: #ffa726;
}

.legend-color.low {
  background: #66bb6a;
}

.region-stats {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.region-card {
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.region-card h4 {
  margin-bottom: 0.75rem;
  color: #333;
}

.region-stat {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.9rem;
}
</style>