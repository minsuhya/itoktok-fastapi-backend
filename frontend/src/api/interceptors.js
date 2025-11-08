// axios interceptors request and response
import { inject } from 'vue'
import axios from 'axios'
import { getToken } from '@/utils/token'
import useAuth from '@/hooks/auth'

const { logoutApp } = useAuth()

// InternalAxiosRequestConfig
if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
}

axios.interceptors.request.use(
  (config) => {
    console.log('interceptors request use')
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  (response) => {
    console.log('interceptors response use')
    const { data: responseData } = response
    return responseData
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized access, redirect to login
        logoutApp()
        // 현재 경로가 모바일인지 확인하여 적절한 로그인 페이지로 리다이렉트
        const currentPath = window.location.pathname
        if (currentPath.startsWith('/mobile')) {
          window.location.href = '/mobile/login'
        } else {
          window.location.href = '/login'
        }
      } else if (error.response.status === 500) {
        alert('Server error. Please try again later.')
      }
      // Handle other status codes as needed
    }
    return Promise.reject(error)
  }
)
