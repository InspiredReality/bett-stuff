<template>
  <button 
    class="nav-button sub-button"
    :class="[
      { active: isActive },
      `${sectionName.toLowerCase().replace(' ', '-')}-sub`
    ]"
    @click="$emit('click')"
  >
    {{ subButton.name }}
  </button>
</template>

<script setup>
defineProps({
  subButton: {
    type: Object,
    required: true
  },
  sectionName: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.sub-button {
  flex: 1;
}

.nav-button {
  border: none;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: calc(100% - 8px);
  height: calc(100% - 8px);
  flex-direction: column;
  text-align: center;
  line-height: 1.2;
}

/* My Stuff sub-buttons - White */
.my-stuff-sub {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  text-shadow: none;
}

.my-stuff-sub:hover {
  background: rgba(255, 255, 255, 1);
}

.my-stuff-sub.active {
  background: white;
  border-top: 3px solid #333;
  font-size: 1.28rem;
}

/* Bet Stuff sub-buttons - Dark Grey */
.bet-stuff-sub {
  background: rgba(128, 128, 128, 0.9);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.bet-stuff-sub:hover {
  background: rgba(128, 128, 128, 1);
}

.bet-stuff-sub.active {
  background: #808080;
  border-top: 3px solid #fff;
  font-size: 1.28rem;
}

/* League Stuff sub-buttons - Black */
.league-stuff-sub {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
}

.league-stuff-sub:hover {
  background: rgba(0, 0, 0, 1);
}

.league-stuff-sub.active {
  background: black;
  border-top: 3px solid #fff;
  font-size: 1.28rem;
}

@media (orientation: landscape) {
  .sub-button {
    flex: 1;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    height: auto;
  }
  
  .sub-button:last-child {
    border-bottom: none;
  }
  
  .nav-button {
    font-size: 0.7rem;
  }
  
  .nav-button.active {
    font-size: 1rem !important;
  }
}
</style>