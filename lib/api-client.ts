// Real API client for Strategy AI FastAPI backend
// Backend URL: https://web-production-6045b.up.railway.app

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-6045b.up.railway.app'

export type Sector = "Technology" | "Healthcare" | "Rail" | "Maritime" | "Highways" | "General"
export type UseCase =
  | "quick-playbook"
  | "lessons-learned"
  | "project-review"
  | "trl-mapping"
  | "project-similarity"
  | "change-management"
  | "product-acceptance"

export type UserType = "public" | "admin" | "analyst"

export interface ChatMessage {
  message: string
  sector?: Sector
  use_case?: UseCase
  user_type?: UserType
  session_id?: string
  model?: string
}

export interface ChatResponse {
  response: string
  sources: {
    document_title: string
    source: string
    relevance_score: number
    chunk_preview: string
  }[]
  confidence: number
  suggested_use_case?: string
  timestamp: string
  model_used: string
  agents_used?: string[]
}

export interface DocumentUploadRequest {
  sector: string
  use_case?: string
  title?: string
}

export interface DocumentResponse {
  success: boolean
  document_id?: string
  message: string
}

export interface SearchRequest {
  search_text: string
  sector?: string
  use_case?: string
  top_k?: number
}

export interface SearchResponse {
  results: {
    document_id: string
    title: string
    chunk_text: string
    relevance_score: number
    metadata: any
  }[]
  total_count: number
  search_time_ms: number
  query: string
  filters: any
}

export interface FeedbackRequest {
  chat_log_id?: string
  document_id?: string
  session_id?: string
  rating: number
  feedback_type?: string
  comment?: string
  helpful?: boolean
}

export interface SystemHealth {
  status: string
  timestamp: string
  environment: string
  version: string
  services: {
    database: string
    vector_store: string
    ai_service: string
    multi_agents: string
    document_processor: string
    feedback_system: string
  }
  system: {
    cpu_percent: number
    memory_used_mb: number
    threads: number
    uptime_seconds: number
    note?: string
  }
  metrics: {
    total_documents: number
    total_sectors: number
    total_use_cases: number
    total_feedback: number
  }
  ai_integration: string
  features: {
    multi_agent_system: boolean
    document_processing: boolean
    semantic_search: boolean
    user_feedback: boolean
    real_time_analytics: boolean
    advanced_chat: boolean
  }
}

// Helper function for API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    })

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error)
    throw error
  }
}

// Real API client connected to your backend
const apiClient = {
  // Health and status
  health: {
    check: async (): Promise<SystemHealth> => {
      return apiCall<SystemHealth>('/health')
    },

    aiStatus: async () => {
      return apiCall('/ai/status')
    }
  },

  // Chat with multi-agent orchestration
  chat: {
    sendMessage: async (message: ChatMessage): Promise<ChatResponse> => {
      return apiCall<ChatResponse>('/chat', {
        method: 'POST',
        body: JSON.stringify(message),
      })
    },

    sendAdvancedMessage: async (message: ChatMessage): Promise<ChatResponse> => {
      return apiCall<ChatResponse>('/chat/advanced', {
        method: 'POST',
        body: JSON.stringify(message),
      })
    },
  },

  // Document management
  documents: {
    upload: async (file: File, metadata: DocumentUploadRequest): Promise<DocumentResponse> => {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sector', metadata.sector)
      if (metadata.use_case) formData.append('use_case', metadata.use_case)
      if (metadata.title) formData.append('title', metadata.title)

      return apiCall<DocumentResponse>('/documents/upload', {
        method: 'POST',
        body: formData,
        headers: {}, // Don't set Content-Type for FormData
      })
    },

    list: async (params: {
      sector?: string
      use_case?: string
      source_type?: string
      search?: string
      min_rating?: number
      limit?: number
      offset?: number
    } = {}) => {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString())
      })
      
      const query = queryParams.toString()
      return apiCall(`/documents${query ? '?' + query : ''}`)
    },

    get: async (documentId: string) => {
      return apiCall(`/documents/${documentId}`)
    },

    delete: async (documentId: string): Promise<void> => {
      await apiCall(`/documents/${documentId}`, {
        method: 'DELETE'
      })
    },
  },

  // Semantic search
  search: {
    semantic: async (request: SearchRequest): Promise<SearchResponse> => {
      return apiCall<SearchResponse>('/search', {
        method: 'POST',
        body: JSON.stringify(request),
      })
    },
  },

  // User feedback
  feedback: {
    submit: async (feedback: FeedbackRequest) => {
      return apiCall('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedback),
      })
    },

    getAnalytics: async (days: number = 30) => {
      return apiCall(`/feedback/analytics?days=${days}`)
    },
  },

  // Multi-agent system
  agents: {
    getStatus: async () => {
      return apiCall('/agents/status')
    },

    analyze: async (requestData: any) => {
      return apiCall('/agents/analyze', {
        method: 'POST',
        body: JSON.stringify(requestData),
      })
    },
  },

  // Authentication (if needed)
  auth: {
    login: async (username: string, password: string) => {
      return apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      })
    },

    getUser: async () => {
      return apiCall('/auth/me')
    },
  },
}

export default apiClient
