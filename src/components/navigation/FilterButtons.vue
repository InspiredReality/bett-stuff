<template>
  <div class="filter-buttons" ref="filterContainer" @scroll="handleScroll">
    <div class="filter-buttons-container" ref="scrollContainer">
      <button
        v-for="(filter, index) in navigationStore.availableFilters"
        :key="filter"
        :ref="el => filterRefs[index] = el"
        class="filter-button"
        :class="{ active: navigationStore.currentFilter === filter }"
        @click="handleFilterClick(filter, index)"
      >
        {{ filter }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useNavigationStore } from '@/stores/navigation'

const navigationStore = useNavigationStore()
const filterContainer = ref(null)
const scrollContainer = ref(null)
const filterRefs = ref([])
let isScrolling = false
let scrollTimeout = null

function handleScroll() {
  if (isScrolling || !filterContainer.value || filterRefs.value.length === 0) return

  // Clear any existing timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }

  // Debounce slightly to avoid too many updates
  scrollTimeout = setTimeout(() => {
    const containerRect = filterContainer.value.getBoundingClientRect()
    const containerCenter = containerRect.left + containerRect.width / 2

    let closestIndex = 0
    let closestDistance = Infinity

    // Find which filter button is closest to the center
    filterRefs.value.forEach((button, index) => {
      if (button) {
        const buttonRect = button.getBoundingClientRect()
        const buttonCenter = buttonRect.left + buttonRect.width / 2
        const distance = Math.abs(buttonCenter - containerCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      }
    })

    // Update the active filter if it changed
    if (closestIndex !== navigationStore.currentFilterIndex) {
      navigationStore.selectFilter(navigationStore.availableFilters[closestIndex], closestIndex)
    }
  }, 50) // 50ms debounce for smooth but responsive updates
}

function handleFilterClick(filter, index) {
  isScrolling = true
  navigationStore.selectFilter(filter, index)

  // Scroll the clicked button to center
  if (filterRefs.value[index]) {
    filterRefs.value[index].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    })
  }

  setTimeout(() => {
    isScrolling = false
  }, 500)
}

// Watch for external filter changes and scroll to the active one
watch(() => navigationStore.currentFilterIndex, (newIndex) => {
  if (!isScrolling && filterRefs.value[newIndex]) {
    nextTick(() => {
      filterRefs.value[newIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    })
  }
})
</script>

<style scoped>
.filter-buttons {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 3rem;
  min-height: 48px;
  overflow-x: auto; /* Enable horizontal scrolling */
  overflow-y: visible;
  scrollbar-width: none;
  -ms-overflow-style: none;
  position: relative;
  padding: 0.5rem 1rem;
  width: 100%;
  touch-action: pan-x; /* Allow horizontal swipe gestures */
  user-select: none; /* Prevent text selection during swipe */
  background: rgba(0, 0, 0, 0.05);
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
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
    padding: 0.5rem 0.5rem !important;
    height: 3rem !important;
    min-height: 50px !important;
  }

  .filter-buttons-container {
    justify-content: space-around !important;
    width: 100% !important;
  }

  .filter-button {
    font-size: 0.75rem !important;
    padding: 0.4rem 0.9rem !important;
  }
}

@media (orientation: landscape) {
  .filter-buttons {
    justify-content: center !important;
    width: 100% !important;
    padding: 0.5rem 1rem !important;
    margin: 0 auto !important;
  }

  .filter-buttons-container {
    justify-content: center !important;
    width: 100% !important;
    max-width: none !important;
  }
}
</style>
