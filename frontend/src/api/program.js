import axios from 'axios'

// Program CRUD API 함수
export const createProgram = async (info) => {
  try {
    const response = await axios.post('/programs', info)
    return response.data
  } catch (error) {
    console.error('Error creating program:', error)
    throw error
  }
}

export const readProgram = async (programId) => {
  try {
    const response = await axios.get(`/programs/${programId}`)
    return response.data
  } catch (error) {
    console.error('Error reading program:', error)
    throw error
  }
}

export const readPrograms = async (page = 1, size = 10, search_qry = '', teacher_username = '') => {
  try {
    const response = await axios.get('/programs', {
      params: { page, size, search_qry, teacher_username }
    })
    return response
  } catch (error) {
    console.error('Error reading programs:', error)
    throw error
  }
}

export const updateProgram = async (programId, info) => {
  try {
    const response = await axios.put(`/programs/${programId}`, info)
    return response.data
  } catch (error) {
    console.error('Error updating program:', error)
    throw error
  }
}

export const deleteProgram = async (programId) => {
  try {
    const response = await axios.delete(`/programs/${programId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting program:', error)
    throw error
  }
} 