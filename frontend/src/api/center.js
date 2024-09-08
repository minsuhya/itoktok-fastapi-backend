import axios from 'axios'

// Center Info CRUD API 함수
export const registerCenterInfo = async (info) => {
  try {
    const response = await axios.post('/center/info', info)
    return response.data
  } catch (error) {
    console.error('Error registering center info:', error)
    throw error
  }
}

export const readCenterInfo = async (username) => {
  try {
    const response = await axios.get(`/center/info/${username}`)
    return response.data
  } catch (error) {
    console.error('Error reading center info:', error)
    throw error
  }
}

export const readCenterInfos = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get('/center/info', {
      params: { page, limit }
    })
    return response.data
  } catch (error) {
    console.error('Error reading center infos:', error)
    throw error
  }
}

export const updateCenterInfo = async (username, info) => {
  try {
    const response = await axios.put(`/center/info/${username}`, info)
    return response.data
  } catch (error) {
    console.error('Error updating center info:', error)
    throw error
  }
}

export const deleteCenterInfo = async (username) => {
  try {
    const response = await axios.delete(`/center/info/${username}`)
    return response.data
  } catch (error) {
    console.error('Error deleting center info:', error)
    throw error
  }
}
