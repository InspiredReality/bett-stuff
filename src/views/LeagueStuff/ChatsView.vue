<template>
  <div class="chats-view">
    <h2>League Chats</h2>
    <div v-if="navigationStore.currentFilter" class="filter-info">
      Channel: {{ navigationStore.currentFilter }}
    </div>
    
    <div class="chat-container">
      <div class="messages-area">
        <div v-for="message in messages" :key="message.id" class="message">
          <div class="message-header">
            <span class="username">{{ message.user }}</span>
            <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
          </div>
          <div class="message-content">{{ message.content }}</div>
        </div>
      </div>
      
      <div class="chat-input">
        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
        >
        <button @click="sendMessage" class="send-btn">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useUserStore } from '@/stores/user'

const navigationStore = useNavigationStore()
const userStore = useUserStore()

const newMessage = ref('')
const messages = ref([
  { id: 1, user: 'Player123', content: 'Anyone want to bet on tonight\'s game?', timestamp: new Date() },
  { id: 2, user: 'BetMaster', content: 'I\'m in! What\'s the spread?', timestamp: new Date() },
  { id: 3, user: 'LuckyOne', content: 'Count me in too', timestamp: new Date() }
])

function sendMessage() {
  if (newMessage.value.trim()) {
    messages.value.push({
      id: messages.value.length + 1,
      user: userStore.displayName || 'You',
      content: newMessage.value,
      timestamp: new Date()
    })
    newMessage.value = ''
  }
}

function formatTime(timestamp) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(timestamp)
}
</script>

<style scoped>
.chats-view {
  padding: 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.messages-area {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  background: #f9f9f9;
  padding: 0.75rem;
  border-radius: 8px;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.username {
  font-weight: 600;
  color: #333;
}

.timestamp {
  font-size: 0.8rem;
  color: #999;
}

.message-content {
  color: #666;
}

.chat-input {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #eee;
  gap: 0.5rem;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.send-btn {
  padding: 0.75rem 1.5rem;
  background: #808080;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:hover {
  background: #666;
}
</style>