import axios from 'axios'

const unwrapResponseData = (response) =>
  response && typeof response === 'object' && 'data' in response ? response.data : response

// Client Info CRUD API 함수
export const registerClientInfo = async (info) => {
  try {
    const response = await axios.post('/client/', info)
    return response
  } catch (error) {
    console.error('Error registering client info:', error)
    throw error
  }
}

export const readClientInfo = async (clientId) => {
  try {
    const response = await axios.get(`/client/${clientId}`)
    return unwrapResponseData(response)
  } catch (error) {
    console.error('Error reading client info:', error)
    throw error
  }
}

export const readClientInfos = async (page = 1, size = 10, search_qry = '') => {
  try {
    const response = await axios.get('/client/', {
      params: { page, size, search_qry }
    })
    return response
  } catch (error) {
    console.error('Error reading client infos:', error)
    throw error
  }
}

export const searchClientInfos = async (search_qry = '') => {
  try {
    const response = await axios.get('/client/search/', {
      params: { search_qry }
    })
    return unwrapResponseData(response)
  } catch (error) {
    console.error('Error reading client infos:', error)
    throw error
  }
}

export const updateClientInfo = async (clientId, info) => {
  try {
    const response = await axios.put(`/client/${clientId}`, info)
    return response
  } catch (error) {
    console.error('Error updating client info:', error)
    throw error
  }
}

export const updateClientConsultantStauts = async (clientId, status) => {
  try {
    const response = await axios.put(`/client/${clientId}/consultant_status/${status}`)
    return response
  } catch (error) {
    console.error('Error updating client info:', error)
    throw error
  }
}

export const deleteClientInfo = async (clientId) => {
  try {
    const response = await axios.delete(`/client/${clientId}`)
    return response
  } catch (error) {
    console.error('Error deleting client info:', error)
    throw error
  }
}
