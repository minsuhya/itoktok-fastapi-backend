// axios interceptors request and response
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
    const { data: responseData } = response
    return responseData
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized access, redirect to login
        logoutApp()
        window.location.href = '/login'
      }
      // Handle other status codes as needed
    }
    return Promise.reject(error)
  }
)
