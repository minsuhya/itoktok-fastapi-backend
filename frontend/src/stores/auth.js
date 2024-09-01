import { defineStore } from 'pinia'
import { getToken } from '@/utils/token'

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
      this.role = userInfo.is_superuser == 1 ? 1 : userInfo.is_superuser == 2 ? 2 : 3
      this.showLogoutModal = false
    },
    clearUserInfo() {
      // Clear user data and token
      this.user = null
      this.isAuthenticated = false
      this.role = null
      this.showLogoutModal = true
    },
    checkAuth() {
      const token = getToken()
      if (token) {
        this.isAuthenticated = true
      }
    },
    closeLogoutModal() {
      this.showLogoutModal = false
    }

    // async refreshUserInfo() {
    //   const res = await getUserInfo()
    //   this.setUserInfo(res.data)
    // }
  }
})
