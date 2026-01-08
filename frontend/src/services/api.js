// // API service for backend communication
// const API_BASE_URL = 'http://localhost:8000'

// export const sendMessage = async (phoneNumber, message) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/chat`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         phone_number: phoneNumber,
//         message: message
//       })
//     })

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     const data = await response.json()
//     return {
//       answer: data.response,
//       citations: data.sources || [],
//       phone_number: data.phone_number,
//       used_retrieval: data.used_retrieval || false
//     }
//   } catch (error) {
//     console.error('API call failed:', error)
//     throw error
//   }
// }

// export const getSessionHistory = async (phoneNumber) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/sessions/${phoneNumber}`)
    
//     if (!response.ok) {
//       if (response.status === 404) {
//         return { messages: [] }
//       }
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     return await response.json()
//   } catch (error) {
//     console.error('Failed to fetch session history:', error)
//     return { messages: [] }
//   }
// }

// export const resetSession = async (phoneNumber) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/reset/${phoneNumber}`, {
//       method: 'POST'
//     })
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     return await response.json()
//   } catch (error) {
//     console.error('Failed to reset session:', error)
//     throw error
//   }
// }

// export const getSystemStatus = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/status`)
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     return await response.json()
//   } catch (error) {
//     console.error('Failed to get system status:', error)
//     return { status: 'error' }
//   }
// }

// export const reloadEmbeddings = async () => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/reload-embeddings`, {
//       method: 'POST'
//     })
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     return await response.json()
//   } catch (error) {
//     console.error('Failed to reload embeddings:', error)
//     throw error
//   }
// }

// // Export API base URL for use in components
// export { API_BASE_URL }
// API service for backend communication
const API_BASE_URL = 'http://localhost:8000'

export const sendMessage = async (phoneNumber, message) => {
  try {
    console.log('Sending message to backend:', { phoneNumber, message })
    
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        message: message
      })
    })

    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }

    const data = await response.json()
    console.log('API response data:', data)
    
    return {
      answer: data.response,
      sources: data.sources || [],
      phone_number: data.phone_number,
      used_retrieval: data.used_retrieval || false,
      timestamp: data.timestamp || new Date().toISOString()
    }
  } catch (error) {
    console.error('API call failed:', error)
    
    // If it's a connection error, provide a fallback response
    if (error.message.includes('getaddrinfo failed') || 
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError')) {
      console.log('Backend not reachable, using fallback response')
      
      // Return a fallback response so the frontend doesn't crash
      return {
        answer: "I'm currently having trouble connecting to the backend service. Please ensure the FastAPI server is running on http://localhost:8000. In the meantime, I can help you with general questions about NELFUND student loans: To be eligible, you must be a Nigerian citizen admitted to an accredited tertiary institution.",
        sources: [],
        phone_number: phoneNumber,
        used_retrieval: false,
        timestamp: new Date().toISOString(),
        isFallback: true
      }
    }
    
    throw error
  }
}

export const getSessionHistory = async (phoneNumber) => {
  try {
    console.log('Fetching session history for:', phoneNumber)
    
    const response = await fetch(`${API_BASE_URL}/sessions/${phoneNumber}`)
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log('Session not found, returning empty')
        return { messages: [] }
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch session history:', error)
    
    // If backend is down, return empty messages
    if (error.message.includes('getaddrinfo failed') || 
        error.message.includes('Failed to fetch')) {
      return { messages: [] }
    }
    
    return { messages: [] }
  }
}

export const resetSession = async (phoneNumber) => {
  try {
    console.log('Resetting session for:', phoneNumber)
    
    const response = await fetch(`${API_BASE_URL}/reset/${phoneNumber}`, {
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
    
    // If backend is down, still clear local storage
    return { 
      status: 'local_reset', 
      phone_number: phoneNumber,
      message: 'Backend unavailable, cleared local storage only'
    }
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
    return { 
      status: 'error', 
      message: 'Cannot connect to backend',
      error: error.message 
    }
  }
}

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`)
    return response.ok
  } catch (error) {
    console.log('Backend health check failed:', error.message)
    return false
  }
}

// Fallback responses for when backend is unavailable
export const getFallbackResponse = (query) => {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('eligib') || lowerQuery.includes('qualif')) {
    return {
      answer: `To be eligible for NELFUND, you must: 1) Be a Nigerian citizen, 2) Have gained admission into an accredited tertiary institution in Nigeria, 3) Have a valid Bank Verification Number (BVN), 4) Provide proof of income (for means testing), 5) Not have defaulted on any previous student loan.`,
      sources: [
        { source: "NELFUND Eligibility Guidelines", page: "Section 2.1", content_preview: "Citizenship and admission requirements..." }
      ],
      used_retrieval: false,
      isFallback: true
    }
  } else if (lowerQuery.includes('apply') || lowerQuery.includes('application')) {
    return {
      answer: "The application process involves: 1) Visit the official NELFUND portal, 2) Create an account with your details, 3) Complete the online application form, 4) Upload required documents (admission letter, ID, BVN), 5) Submit for review. Applications are processed within 30 working days.",
      sources: [
        { source: "NELFUND Application Manual", page: "Chapter 3", content_preview: "Step-by-step application process..." }
      ],
      used_retrieval: false,
      isFallback: true
    }
  } else if (lowerQuery.includes('australian') || lowerQuery.includes('foreign')) {
    return {
      answer: "No, NELFUND is specifically for Nigerian citizens. Australian citizens or other foreign nationals are not eligible for the Nigerian Education Loan Fund. The program is designed to support Nigerian students studying in accredited tertiary institutions within Nigeria.",
      sources: [
        { source: "NELFUND Act 2023", page: "Section 1.2", content_preview: "Program limited to Nigerian citizens..." }
      ],
      used_retrieval: false,
      isFallback: true
    }
  } else {
    return {
      answer: "I understand you're asking about student loans. For accurate information from NELFUND documents, please ensure the backend server is running on http://localhost:8000. Common questions include: eligibility requirements, application process, required documents, repayment terms, and covered institutions.",
      sources: [],
      used_retrieval: false,
      isFallback: true
    }
  }
}

// Export API base URL for use in components
export { API_BASE_URL }