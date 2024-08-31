import axios from 'axios'

export function getUserInfo() {
  return axios.post('/api/user/info')
}

export function login(data) {
  data = {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  }
  return axios.post('/api/login', data)
}

export function logout() {
  return axios.post('/api/logout')
}

export function forgot_password() {
  return axios.post('/api/forget-password')
}
