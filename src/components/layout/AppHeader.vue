<template>
  <header class="header" :class="navigationStore.headerClass">
    <h1 class="main-title">{{ navigationStore.pageTitle }}</h1>
  </header>
</template>

<script setup>
import { useNavigationStore } from '@/stores/navigation'

const navigationStore = useNavigationStore()
</script>

<style scoped>
.header {
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  text-align: center;
  border-bottom: none;
  height: 6vh;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
  background: transparent !important; /* Make header background transparent */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Very high z-index to stay above all content */
  pointer-events: none; /* Allow clicks to pass through transparent areas */
}

.header .main-title {
  pointer-events: auto; /* Re-enable clicks on the title pill */
  position: relative;
  z-index: 1001; /* Even higher than header to ensure it's always on top */
}

.main-title {
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  width: auto;
  padding: 0.4rem 1.5rem;
  border-radius: 12px;
  display: inline-block;
  white-space: nowrap;
}

/* My Stuff title styling */
.header.my-stuff .main-title {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  text-shadow: none;
}

/* Bet Stuff title styling */
.header.bet-stuff .main-title {
  background: rgba(128, 128, 128, 0.9);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* League Stuff title styling */
.header.league-stuff .main-title {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
}

/* Default title styling */
.header.default .main-title {
  background: rgba(128, 128, 128, 0.9);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@media (orientation: landscape) {
  .header {
    height: 6vh;
    min-height: 50px;
    width: 100%;
  }
}
</style>