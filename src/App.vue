<template>
  <div class="app-container" :class="orientationClass">
    <AppHeader />
    <div class="content-wrapper">
      <ContentArea />
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
}

.content-wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
}

@media (orientation: landscape) {
  .app-container {
    flex-direction: row;
  }
  
  .content-wrapper {
    flex-direction: row;
  }
}
</style>