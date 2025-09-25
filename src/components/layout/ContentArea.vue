<template>
  <main class="content-area" ref="contentRef">
    <div class="page-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const contentRef = ref(null)

onMounted(() => {
  // Ensure content area is scrollable
  if (contentRef.value) {
    contentRef.value.scrollTop = 0
  }
})
</script>

<style scoped>
.content-area {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(135deg, #2c2c2c 0%, #f0f0f0 100%);
  position: relative;
  width: 100%;
  min-height: 0; /* Important for proper scrolling */
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
}

.page-content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  min-height: 100%;
  position: relative;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Portrait mode adjustments */
@media (orientation: portrait) {
  .content-area {
    /* Account for navigation height at bottom */
    margin-bottom: 0;
    padding-bottom: 1rem;
  }
}

/* Landscape mode adjustments */
@media (orientation: landscape) {
  .content-area {
    flex: 1;
    margin-bottom: 0;
    padding-bottom: 1rem;
    order: 1;
    /* Account for navigation width on side */
    margin-right: 0;
  }
}

/* Ensure content doesn't get hidden behind navigation */
.page-content {
  margin-bottom: env(safe-area-inset-bottom, 0);
}
</style>