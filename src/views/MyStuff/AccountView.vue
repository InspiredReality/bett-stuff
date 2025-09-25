<template>
  <div class="account-view">
    <h2>Account Settings</h2>
    
    <div v-if="navigationStore.currentFilter === 'Profile'" class="profile-section">
      <div class="profile-card">
        <div class="avatar">
          <img :src="userStore.user?.display_icon_path || '/default-avatar.png'" alt="Profile">
        </div>
        <div class="profile-info">
          <h3>{{ userStore.displayName || 'User' }}</h3>
          <p>{{ userStore.user?.login_email }}</p>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-value">{{ totalBets }}</span>
          <span class="stat-label">Total Bets</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ winRate }}%</span>
          <span class="stat-label">Win Rate</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ activeBets }}</span>
          <span class="stat-label">Active</span>
        </div>
      </div>
    </div>
    
    <div v-else-if="navigationStore.currentFilter === 'Settings'" class="settings-section">
      <div class="setting-group">
        <h3>Security</h3>
        <button @click="showPasswordModal = true" class="btn btn-primary">
          Change Password
        </button>
      </div>
      
      <div class="setting-group">
        <h3>Preferences</h3>
        <div class="preference-item">
          <label>
            <input type="checkbox" v-model="notifications">
            Enable Notifications
          </label>
        </div>
        <div class="preference-item">
          <label>
            <input type="checkbox" v-model="darkMode">
            Dark Mode
          </label>
        </div>
      </div>
      
      <div class="setting-group">
        <button @click="handleLogout" class="btn btn-danger">
          Logout
        </button>
      </div>
    </div>
    
    <!-- Password Change Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
      <div class="modal">
        <h3>Change Password</h3>
        <form @submit.prevent="handlePasswordChange">
          <input 
            type="password" 
            v-model="currentPassword" 
            placeholder="Current Password"
            required
          >
          <input 
            type="password" 
            v-model="newPassword" 
            placeholder="New Password"
            required
          >
          <input 
            type="password" 
            v-model="confirmPassword" 
            placeholder="Confirm New Password"
            required
          >
          <div class="modal-actions">
            <button type="button" @click="showPasswordModal = false" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useNavigationStore } from '@/stores/navigation'
import { useUserStore } from '@/stores/user'
import { useBetsStore } from '@/stores/bets'
import { useRouter } from 'vue-router'

const navigationStore = useNavigationStore()
const userStore = useUserStore()
const betsStore = useBetsStore()
const router = useRouter()

const showPasswordModal = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const notifications = ref(true)
const darkMode = ref(false)

const totalBets = computed(() => betsStore.bets.length)
const activeBets = computed(() => betsStore.openBets.length + betsStore.liveBets.length)
const winRate = computed(() => {
  // Calculate win rate logic here
  return 65
})

async function handlePasswordChange() {
  if (newPassword.value !== confirmPassword.value) {
    alert('Passwords do not match')
    return
  }
  
  const success = await userStore.changePassword(currentPassword.value, newPassword.value)
  if (success) {
    showPasswordModal.value = false
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    alert('Password changed successfully')
  }
}

async function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    await userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.account-view {
  padding: 1rem;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ddd;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

.setting-group {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.setting-group h3 {
  margin-bottom: 1rem;
  color: #333;
}

.preference-item {
  padding: 0.5rem 0;
}

.preference-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #808080;
  color: white;
}

.btn-secondary {
  background: #ccc;
  color: #333;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
}

.modal h3 {
  margin-bottom: 1.5rem;
}

.modal input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
</style>