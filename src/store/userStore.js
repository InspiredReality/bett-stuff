import { create } from 'zustand'
import { authService } from '@/services/api'

export const useUserStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Computed getters
  isAuthenticated: () => !!get().token,
  getDisplayName: () => get().user?.display_name || '',

  // Actions
  login: async (credentials) => {
    set({ isLoading: true, error: null })

    try {
      const response = await authService.login(credentials)
      localStorage.setItem('token', response.access_token)
      set({
        token: response.access_token,
        user: response.user
      })
      return true
    } catch (err) {
      set({ error: err.message })
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null })

    try {
      const response = await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      })
      localStorage.setItem('token', response.access_token)
      set({ token: response.access_token })
      return true
    } catch (err) {
      set({ error: err.message })
      return false
    } finally {
      set({ isLoading: false })
    }
  },

  setUser: (user) => set({ user }),

  clearError: () => set({ error: null })
}))
