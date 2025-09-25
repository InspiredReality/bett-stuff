<template>
  <div class="error-message">
    <span class="error-icon">⚠️</span>
    <p>{{ message }}</p>
    <button v-if="onRetry" @click="onRetry" class="retry-btn">
      Try Again
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  onRetry: {
    type: Function,
    default: null
  }
})
</script>

<style scoped>
.error-message {
  background: #ffebee;
  border: 1px solid #ffcdd2;
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  text-align: center;
  color: #c62828;
}

.error-icon {
  font-size: 24px;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.retry-btn {
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-danger);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-fast);
}

.retry-btn:hover {
  opacity: 0.9;
}
</style>
