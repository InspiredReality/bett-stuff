<template>
  <div class="app-container" :class="orientationClass">
    <!-- Header is always visible -->
    <AppHeader />
    
    <div class="content-wrapper">
      <!-- Content area with router view -->
      <ContentArea />
      
      <!-- Navigation is ALWAYS visible outside of router-view -->
      <AppNavigation />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppNavigation from '@/components/layout/AppNavigation.vue'
import ContentArea from '@/components/layout/ContentArea.vue'

const navigationStore = useNavigationStore()

const orientationClass = computed(() => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
})

const handleResize = () => {
  navigationStore.updateOrientation()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  navigationStore.initializeApp()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.app-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.content-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  min-height: 0; /* Important for flex children */
}

/* Portrait mode (default) */
@media (orientation: portrait) {
  .app-container {
    flex-direction: column;
  }
  
  .content-wrapper {
    flex-direction: column;
  }
}

/* Landscape mode */
@media (orientation: landscape) {
  .app-container {
    flex-direction: row;
  }
  
  .content-wrapper {
    flex-direction: row;
    flex: 1;
  }
}

/* Ensure full width on all devices */
@media (min-width: 768px) {
  .app-container {
    max-width: none !important;
    width: 100vw !important;
    margin: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
  }
}
</style>
