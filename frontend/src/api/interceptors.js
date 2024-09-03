// axios interceptors request and response
import axios from 'axios'
import { getToken } from '@/utils/token'

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
        // authStore.logout();
        // window.location.href = '/' // Or use Vue Router to redirect
      } else if (error.response.status === 500) {
        alert('Server error. Please try again later.')
      }
      // Handle other status codes as needed
    }
    return Promise.reject(error)
  }
)
