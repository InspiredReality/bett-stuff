<template>
  <div class="filter-buttons" ref="filterContainer">
    <div class="filter-buttons-container">
      <button 
        v-for="(filter, index) in navigationStore.availableFilters"
        :key="filter"
        class="filter-button"
        :class="{ active: navigationStore.currentFilter === filter }"
        @click="navigationStore.selectFilter(filter, index)"
      >
        {{ filter }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useSwipeGesture } from '@/composables/useSwipeGesture'

const navigationStore = useNavigationStore()
const filterContainer = ref(null)

onMounted(() => {
  useSwipeGesture(filterContainer.value, {
    onSwipeLeft: () => {
      if (navigationStore.currentFilterIndex < navigationStore.availableFilters.length - 1) {
        const nextIndex = navigationStore.currentFilterIndex + 1
        navigationStore.selectFilter(navigationStore.availableFilters[nextIndex], nextIndex)
      }
    },
    onSwipeRight: () => {
      if (navigationStore.currentFilterIndex > 0) {
        const prevIndex = navigationStore.currentFilterIndex - 1
        navigationStore.selectFilter(navigationStore.availableFilters[prevIndex], prevIndex)
      }
    }
  })
})
</script>

<style scoped>
.filter-buttons {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 4rem;
  overflow-x: hidden;
  overflow-y: visible;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
  padding: 0.75rem 1rem;
  width: 100%;
}

.filter-buttons::-webkit-scrollbar {
  display: none;
}

.filter-buttons-container {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  transition: transform 0.3s ease;
  height: 100%;
  width: max-content;
}

.filter-button {
  border: 2px solid transparent;
  background: rgba(128, 128, 128, 0.9);
  color: white !important;
  border-radius: 15px;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-width: 28%;
  max-width: 32%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.filter-button:hover {
  background: rgba(128, 128, 128, 1);
}

.filter-button.active {
  background: linear-gradient(135deg, #ddd 0%, #888 50%, #555 100%) !important;
  border: 3px solid #000;
  transform: scale(1.1);
  font-weight: 950 !important;
  color: white !important;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4), 
              0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
  position: relative;
}

@media (orientation: portrait) {
  .filter-buttons {
    justify-content: space-around !important;
    width: 100% !important;
    padding: 0.5rem 1rem !important;
  }
  
  .filter-buttons-container {
    justify-content: space-around !important;
    width: 100% !important;
  }
}

@media (orientation: landscape) {
  .filter-buttons {
    justify-content: center !important;
    width: calc(100vw - 8vw - 15vw) !important;
    padding: 0.5rem 2rem !important;
    margin: 0 auto !important;
  }
  
  .filter-buttons-container {
    justify-content: center !important;
    width: 100% !important;
    max-width: none !important;
  }
}
</style>
