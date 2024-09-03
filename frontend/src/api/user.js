import axios from 'axios'

export function login(data) {
  return axios.post('/auth/login', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}

export function logout() {
  return axios.post('/auth/logout')
}

export const checkUsername = async (username) => {
  try {
    const response = await axios.get(`/signup/check-username?username=${username}`)
    return response.data
  } catch (error) {
    console.error('Error reading user:', error)
    throw error
  }
}

export const signup = async (values) => {
  try {
    if (!values.center_username) {
      values.center_username = values.username
    }
    const response = await axios.post(`/signup`, values)
    return response.data
  } catch (error) {
    console.error('Error reading user:', error)
    throw error
  }
}

export function forgot_password() {
  return axios.post('/api/forget-password')
}

// User CRUD API 함수
export const registerUser = async (user) => {
  try {
    const response = await axios.post('/users', user)
    return response.data
  } catch (error) {
    console.error('Error registering user:', error)
    throw error
  }
}

export const readMe = async () => {
  try {
    const response = await axios.get(`/users/me`)
    return response.data
  } catch (error) {
    console.error('Error reading user:', error)
    throw error
  }
}

export const readUser = async (username) => {
  try {
    const response = await axios.get(`/users/${username}`)
    return response.data
  } catch (error) {
    console.error('Error reading user:', error)
    throw error
  }
}

export const readUsers = async (skip = 0, limit = 10) => {
  try {
    const response = await axios.get('/users', {
      params: { skip, limit }
    })
    return response.data
  } catch (error) {
    console.error('Error reading users:', error)
    throw error
  }
}

export const updateUser = async (username, user) => {
  try {
    const response = await axios.put(`/users/${username}`, user)
    return response.data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export const deleteUser = async (username) => {
  try {
    const response = await axios.delete(`/users/${username}`)
    return response.data
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
