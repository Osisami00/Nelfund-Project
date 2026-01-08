// API service for backend communication
const API_BASE_URL = 'http://localhost:8000'

export const sendMessage = async (phone_number, message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        phone_number: phone_number, // Correct: phone_number
        message: message
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    return {
      answer: data.response,
      sources: data.sources || [],
      phone_number: data.phone_number,
      used_retrieval: data.used_retrieval || false,
      timestamp: data.timestamp || new Date().toISOString()
    }
  } catch (error) {
    console.error('API call failed:', error)
    throw error // Re-throw for handling in component
  }
}

export const getSessionHistory = async (phone_number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions/${phone_number}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        return { messages: [] }
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch session history:', error)
    throw error
  }
}

export const resetSession = async (phone_number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/reset/${phone_number}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
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

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to get system status:', error)
    throw error
  }
}

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`)
    const data = await response.json()
    return {
      ok: response.ok,
      data: data
    }
  } catch (error) {
    console.error('Backend health check failed:', error.message)
    throw error
  }
}

// Export API base URL for use in components
export { API_BASE_URL }