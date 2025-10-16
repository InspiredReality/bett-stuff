<template>
  <div class="main-section-view">
    <h2>{{ sectionName }}</h2>
    <div class="section-overview">
      <p>Welcome to {{ sectionName }}. Select an option from the navigation to continue.</p>
      
      <div class="quick-access">
        <h3>Quick Access</h3>
        <div class="quick-links">
          <button 
            v-for="sub in subButtons" 
            :key="sub.name"
            @click="navigateTo(sub)"
            class="quick-link-btn bet-stuff-btn"
          >
            {{ sub.name }}
          </button>
        </div>
      </div>
      
      <div class="recent-activity">
        <h3>Recent Activity</h3>
        <div class="activity-stats">
          <div class="stat-card">
            <span class="stat-value">{{ openBetsCount }}</span>
            <span class="stat-label">Open Bets</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ liveBetsCount }}</span>
            <span class="stat-label">Live Bets</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">{{ completedToday }}</span>
            <span class="stat-label">Completed Today</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useBetsStore } from '@/stores/bets'
import { useRouter } from 'vue-router'

const navigationStore = useNavigationStore()
const betsStore = useBetsStore()
const router = useRouter()

const sectionName = 'Bet Stuff'

const subButtons = computed(() => {
  const section = navigationStore.navSections.find(s => s.name === sectionName)
  return section ? section.subButtons : []
})

// Mock data - replace with actual store data
const openBetsCount = computed(() => betsStore.openBets?.length || 12)
const liveBetsCount = computed(() => betsStore.liveBets?.length || 5)
const completedToday = ref(3)

function navigateTo(sub) {
  navigationStore.selectSubButton(sectionName, sub)
  const section = navigationStore.navSections.find(s => s.name === sectionName)
  if (section) {
    router.push(`${section.path}/${sub.path}`)
  }
}
</script>

<style scoped>
.main-section-view {
  padding: 1rem;
}

.section-overview {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quick-access {
  margin-top: 2rem;
}

.quick-access h3 {
  margin-bottom: 1rem;
  color: #333;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.quick-link-btn {
  padding: 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bet-stuff-btn {
  background: rgba(128, 128, 128, 0.9);
  color: white;
}

.bet-stuff-btn:hover {
  background: #808080;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.recent-activity {
  margin-top: 2rem;
}

.recent-activity h3 {
  margin-bottom: 1rem;
  color: #333;
}

.activity-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #808080;
}

.stat-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.5rem;
}
</style>
