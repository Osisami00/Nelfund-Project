// API service for backend communication
const API_BASE_URL = 'http://localhost:8000'

export const sendMessage = async (phoneNumber, message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        message: message
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      answer: data.response,
      citations: data.sources || [],
      phone_number: data.phone_number,
      used_retrieval: data.used_retrieval || false
    }
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

export const getSessionHistory = async (phoneNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${phoneNumber}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return { messages: [] }
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch session history:', error)
    return { messages: [] }
  }
}

export const resetSession = async (phoneNumber) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset/${phoneNumber}`, {
      method: 'POST'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to reset session:', error)
    throw error
  }
}

export const getSystemStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/status`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to get system status:', error)
    return { status: 'error' }
  }
}

export const reloadEmbeddings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/reload-embeddings`, {
      method: 'POST'
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to reload embeddings:', error)
    throw error
  }
}

// Export API base URL for use in components
export { API_BASE_URL }