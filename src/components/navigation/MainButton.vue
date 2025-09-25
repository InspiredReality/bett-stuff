<template>
  <div 
    :class="['main-button', { expanded: isActive, collapsed: !isActive && siblingActive }]"
    :id="`${section.id}-section`"
  >
    <button 
      class="nav-button"
      @click="$emit('click')"
    >
      {{ section.name }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNavigationStore } from '@/stores/navigation'

const props = defineProps({
  section: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const navigationStore = useNavigationStore()

const siblingActive = computed(() => 
  navigationStore.activeMainButton && 
  navigationStore.activeMainButton !== props.section.name &&
  !navigationStore.showMainButton // Only collapse when sub buttons are shown
)
</script>

<style scoped>
.main-button {
  transition: all 0.3s ease;
  flex: 0 0 33.33%;
  display: flex;
}

.main-button.expanded {
  flex: 0 0 60%;
}

.main-button.collapsed {
  flex: 0 0 20%;
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

/* Section-specific styles */
#my-stuff-section .nav-button {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  text-shadow: none;
}

#my-stuff-section .nav-button:hover {
  background: rgba(255, 255, 255, 1);
}

#bet-stuff-section .nav-button {
  background: rgba(128, 128, 128, 0.9);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

#bet-stuff-section .nav-button:hover {
  background: rgba(128, 128, 128, 1);
}

#league-stuff-section .nav-button {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.2);
}

#league-stuff-section .nav-button:hover {
  background: rgba(0, 0, 0, 1);
}

@media (orientation: landscape) {
  .main-button {
    flex: 0 0 33.33%;
    width: 100%;
    height: 33.33%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .main-button:last-child {
    border-bottom: none;
  }
  
  .main-button.expanded {
    flex: 0 0 60%;
    height: 60%;
  }
  
  .main-button.collapsed {
    flex: 0 0 20%;
    height: 20%;
  }
}
</style>