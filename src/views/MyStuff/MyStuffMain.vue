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
            class="quick-link-btn my-stuff-btn"
          >
            {{ sub.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useRouter } from 'vue-router'

const navigationStore = useNavigationStore()
const router = useRouter()

const sectionName = 'My Stuff'

const subButtons = computed(() => {
  const section = navigationStore.navSections.find(s => s.name === sectionName)
  return section ? section.subButtons : []
})

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

.my-stuff-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: 2px solid #ddd;
}

.my-stuff-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #333;
}
</style>
