<template>
  <header class="header" :class="navigationStore.headerClass">
    <h1 class="main-title">{{ navigationStore.pageTitle }}</h1>
    <FilterButtons v-if="navigationStore.availableFilters.length > 0" />
  </header>
</template>

<script setup>
import { useNavigationStore } from '@/stores/navigation'
import FilterButtons from '@/components/navigation/FilterButtons.vue'

const navigationStore = useNavigationStore()
</script>

<style scoped>
.header {
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  height: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: background-color 0.3s ease;
}

.main-title {
  font-size: 1.2rem;
  font-weight: 600;
  transition: color 0.3s ease, text-shadow 0.3s ease;
  cursor: pointer;
  margin-bottom: 0.25rem;
}

.header.my-stuff {
  background: rgba(255, 255, 255, 0.9);
}

.header.my-stuff .main-title {
  color: #333;
  text-shadow: none;
}

.header.bet-stuff {
  background: rgba(128, 128, 128, 0.9);
}

.header.bet-stuff .main-title {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.header.league-stuff {
  background: rgba(0, 0, 0, 0.9);
}

.header.league-stuff .main-title {
  color: white;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
}

.header.default {
  background: rgba(128, 128, 128, 0.9);
}

.header.default .main-title {
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@media (orientation: landscape) {
  .header {
    height: 10vh;
    width: 100%;
  }
}
</style>