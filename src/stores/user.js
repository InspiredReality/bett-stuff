import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const displayName = computed(() => user.value?.display_name || '')

  async function login(credentials) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      token.value = response.access_token
      user.value = response.user
      localStorage.setItem('token', response.access_token)
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  async function changePassword(currentPassword, newPassword) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      })
      token.value = response.access_token
      localStorage.setItem('token', response.access_token)
      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    displayName,
    login,
    logout,
    changePassword
  }
})
