<template>
  <main class="content-area">
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
// Content area component that displays routed views
</script>

<style scoped>
.content-area {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  background: linear-gradient(135deg, #2c2c2c 0%, #f0f0f0 100%);
  position: relative;
  width: 100%;
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

@media (orientation: portrait) {
  .content-area {
    margin-bottom: -15vh;
    padding-bottom: calc(1rem + 15vh);
  }
}

@media (orientation: landscape) {
  .content-area {
    flex: 1;
    margin-bottom: 0;
    padding-bottom: 1rem;
    order: 1;
  }
}
</style>
