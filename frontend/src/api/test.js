import axios from 'axios'

export function register(data) {
  data = {
    email: 'eve.holt@reqres.in',
    password: 'cityslicka'
  }
  return axios.post('https://reqres.in/api/register', data)
}

export function list_users(page) {
  return axios.get('https://reqres.in/api/users?page=' + page)
}

export function logout() {
  return axios.post('/api/logout')
}

export function forgot_password() {
  return axios.post('/api/forget-password')
}
