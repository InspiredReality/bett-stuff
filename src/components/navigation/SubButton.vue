<template>
  <button 
    class="nav-button sub-button"
    :class="{ active: isActive }"
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

.nav-button.active {
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
