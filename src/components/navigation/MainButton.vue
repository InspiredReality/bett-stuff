<template>
  <div 
    :class="[
      'main-button',
      { 
        'expanded': isActive && !isCollapsed,
        'collapsed': isCollapsed,
        'normal': !isActive && !isCollapsed
      }
    ]"
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
defineProps({
  section: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.main-button {
  transition: all 0.3s ease;
  display: flex;
  flex-shrink: 1;
  flex-grow: 0;
  min-width: 0;
}

/* Normal state - equal width for all 3 buttons */
.main-button.normal {
  flex: 1 1 33.33%;
}

/* Expanded state - button takes more space */
.main-button.expanded {
  flex: 0 0 60%;
}

/* Collapsed state - button is minimized */
.main-button.collapsed {
  flex: 0 0 20%;
}

/* When showing sub-buttons, adjust the layout */
.main-button:has(+ .nav-button.sub-button),
.main-button + .nav-button.sub-button ~ .main-button {
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Collapsed buttons show abbreviated text or icon */
.collapsed .nav-button {
  font-size: 0.8rem;
  padding: 0.25rem;
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
  .main-button.normal {
    flex: 1 1 33.33%;
    width: 100%;
    height: auto;
  }
  
  .main-button.expanded {
    flex: 0 0 60%;
    height: 60%;
  }
  
  .main-button.collapsed {
    flex: 0 0 20%;
    height: 20%;
  }
  
  .main-button {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .main-button:last-child {
    border-bottom: none;
  }
}

/* Responsive text sizing */
@media (max-width: 480px) {
  .collapsed .nav-button {
    font-size: 0.7rem;
  }
  
  .nav-button {
    font-size: 0.9rem;
  }
}
</style>
