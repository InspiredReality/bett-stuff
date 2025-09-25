import api from './api'

export const authService = {
  async login(credentials) {
    return api.post('/login', credentials)
  },
  
  async changePassword(data) {
    return api.post('/change_password', data)
  },
  
  async logout() {
    // Clear local data
    return Promise.resolve()
  }
}
