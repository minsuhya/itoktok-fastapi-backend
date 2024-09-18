import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null, // Holds the user object after login
    isAuthenticated: false, // Tracks authentication status
    role: null, // Holds the user role // 1: superuser, 2: center admin, 3: center teacher
    showLogoutModal: false
  }),

  actions: {
    setUserInfo(userInfo) {
      this.user = userInfo
      this.isAuthenticated = true
      this.role =
        userInfo.is_superuser == 1 ? 'admin' : userInfo.user_type == 1 ? 'center' : 'teacher'
      this.showLogoutModal = false
      this.saveState()
    },
    clearUserInfo() {
      // Clear user data and token
      this.user = null
      this.isAuthenticated = false
      this.role = null
      this.showLogoutModal = true
      this.clearState()
    },
    closeLogoutModal() {
      this.showLogoutModal = false
    },
    saveState() {
      localStorage.setItem('userStore', JSON.stringify(this.$state))
    },
    loadState() {
      const savedState = localStorage.getItem('userStore')
      if (savedState) {
        this.$state = JSON.parse(savedState)
      }
    },
    clearState() {
      localStorage.removeItem('userStore')
    }
  }
})
