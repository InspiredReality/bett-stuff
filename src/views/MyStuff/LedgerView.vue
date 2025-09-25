<template>
  <div class="ledger-view">
    <h2>Betting Ledger</h2>
    
    <div class="ledger-summary">
      <div class="summary-card positive">
        <span class="label">Total Won</span>
        <span class="amount">+${{ totalWon }}</span>
      </div>
      <div class="summary-card negative">
        <span class="label">Total Lost</span>
        <span class="amount">-${{ totalLost }}</span>
      </div>
      <div class="summary-card" :class="netClass">
        <span class="label">Net</span>
        <span class="amount">{{ netAmount }}</span>
      </div>
    </div>
    
    <div class="transactions-list">
      <h3>Recent Transactions</h3>
      <div v-for="transaction in filteredTransactions" :key="transaction.id" class="transaction-item">
        <div class="transaction-info">
          <span class="transaction-type">{{ transaction.type }}</span>
          <span class="transaction-date">{{ formatDate(transaction.date) }}</span>
        </div>
        <div class="transaction-details">
          <span class="transaction-description">{{ transaction.description }}</span>
          <span class="transaction-amount" :class="transaction.amount > 0 ? 'positive' : 'negative'">
            {{ transaction.amount > 0 ? '+' : '' }}${{ Math.abs(transaction.amount) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useUserStore } from '@/stores/user'

const navigationStore = useNavigationStore()
const userStore = useUserStore()

const transactions = ref([
  { id: 1, type: 'Win', date: new Date(), description: 'Bet #1234 - Lakers vs Bulls', amount: 50, user: 'me' },
  { id: 2, type: 'Loss', date: new Date(), description: 'Bet #1235 - Patriots vs Chiefs', amount: -30, user: 'me' },
  { id: 3, type: 'Win', date: new Date(), description: 'Bet #1236 - Yankees vs Red Sox', amount: 75, user: 'other' },
])

const filteredTransactions = computed(() => {
  if (navigationStore.currentFilter === 'Me') {
    return transactions.value.filter(t => t.user === 'me')
  }
  return transactions.value
})

const totalWon = computed(() => {
  return filteredTransactions.value
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalLost = computed(() => {
  return Math.abs(filteredTransactions.value
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0))
})

const netAmount = computed(() => {
  const net = totalWon.value - totalLost.value
  return `${net >= 0 ? '+' : ''}$${Math.abs(net)}`
})

const netClass = computed(() => {
  return totalWon.value - totalLost.value >= 0 ? 'positive' : 'negative'
})

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)
}
</script>

<style scoped>
.ledger-view {
  padding: 1rem;
}

.ledger-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-card .label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.summary-card .amount {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
}

.summary-card.positive .amount {
  color: #4caf50;
}

.summary-card.negative .amount {
  color: #f44336;
}

.transactions-list {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.transactions-list h3 {
  margin-bottom: 1rem;
  color: #333;
}

.transaction-item {
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.transaction-type {
  font-weight: 600;
  color: #333;
}

.transaction-date {
  font-size: 0.9rem;
  color: #999;
}

.transaction-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction-description {
  font-size: 0.95rem;
  color: #666;
}

.transaction-amount {
  font-weight: bold;
}

.transaction-amount.positive {
  color: #4caf50;
}

.transaction-amount.negative {
  color: #f44336;
}
</style>