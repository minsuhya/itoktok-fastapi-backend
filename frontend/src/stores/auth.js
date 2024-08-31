import { defineStore } from 'pinia'
import { getToken } from '@/utils/token'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null, // Holds the user object after login
    isAuthenticated: false, // Tracks authentication status
    role: null // Holds the user role
  }),

  actions: {
    setUserInfo(userInfo) {
      this.user = userInfo
    },
    clearUserInfo() {
      // Clear user data and token
      this.user = null
      this.isAuthenticated = false
    },
    checkAuth() {
      const token = getToken()
      if (token) {
        this.isAuthenticated = true
      }
    }

    // async refreshUserInfo() {
    //   const res = await getUserInfo()
    //   this.setUserInfo(res.data)
    // }
  }
})
