// This is a placeholder for the actual API client implementation
// In a real application, this would connect to your FastAPI backend

export type Sector = "rail" | "maritime" | "highways" | "general"
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
  content: string
  sector?: Sector
  useCase?: UseCase
  userType?: UserType
}

export interface ChatResponse {
  id: string
  content: string
  sources: {
    id: string
    title: string
    excerpt: string
    url?: string
  }[]
  confidence: number
}

export interface UseCaseSuggestion {
  useCase: UseCase
  confidence: number
}

export interface DocumentMetadata {
  title: string
  sector: Sector
  useCase: UseCase[] // Changed from single useCase to array
  source: string
  date: string
}

export interface UploadResponse {
  id: string
  status: "processing" | "complete" | "error"
  message?: string
}

export interface DocumentFilters {
  sector?: Sector
  useCase?: UseCase
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface DocumentListResponse {
  documents: {
    id: string
    title: string
    sector: Sector
    useCases: UseCase[]
    source: string
    date: string
    status: "processing" | "ready" | "error"
  }[]
  total: number
}

export interface SystemAnalytics {
  totalDocuments: number
  queriesPerDay: {
    date: string
    count: number
  }[]
  documentsBySector: {
    sector: Sector
    count: number
  }[]
  averageResponseTime: number
  averageRating: number
}

export interface FeedbackAnalytics {
  ratings: {
    rating: number
    count: number
  }[]
  recentFeedback: {
    id: string
    rating: number
    comment?: string
    date: string
  }[]
}

// Add this type for the dropzone functionality
declare module "react-dropzone" {
  export function useDropzone(options: any): any
}

// Mock API client
const apiClient = {
  chat: {
    sendMessage: async (message: ChatMessage): Promise<ChatResponse> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        id: Date.now().toString(),
        content: "This is a simulated response from the API.",
        sources: [
          {
            id: "doc-1",
            title: "Rail Modernization Strategy 2023",
            excerpt:
              "The rail modernization strategy focuses on digital transformation and sustainable infrastructure development.",
          },
          {
            id: "doc-2",
            title: "Network Rail Technical Strategy",
            excerpt:
              "The technical strategy outlines the approach to implementing new technologies across the rail network.",
          },
        ],
        confidence: 0.87,
      }
    },

    suggestUseCase: async (query: string, sector: Sector): Promise<UseCaseSuggestion> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      return {
        useCase: "quick-playbook",
        confidence: 0.75,
      }
    },
  },

  documents: {
    upload: async (file: File, metadata: DocumentMetadata): Promise<UploadResponse> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return {
        id: Date.now().toString(),
        status: "processing",
      }
    },

    list: async (filters: DocumentFilters): Promise<DocumentListResponse> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      return {
        documents: [
          {
            id: "doc-1",
            title: "Rail Modernization Strategy 2023",
            sector: "rail",
            useCases: ["quick-playbook", "project-review"],
            source: "Network Rail",
            date: "2023-05-15",
            status: "ready",
          },
          {
            id: "doc-2",
            title: "Maritime Safety Guidelines",
            sector: "maritime",
            useCases: ["lessons-learned", "quick-playbook"],
            source: "Maritime Authority",
            date: "2023-02-10",
            status: "ready",
          },
        ],
        total: 2,
      }
    },

    delete: async (id: string): Promise<void> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
    },
  },

  admin: {
    getAnalytics: async (): Promise<SystemAnalytics> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        totalDocuments: 247,
        queriesPerDay: [
          { date: "2023-06-01", count: 120 },
          { date: "2023-06-02", count: 145 },
          { date: "2023-06-03", count: 132 },
        ],
        documentsBySector: [
          { sector: "rail", count: 120 },
          { sector: "maritime", count: 45 },
          { sector: "highways", count: 82 },
        ],
        averageResponseTime: 1.2,
        averageRating: 4.2,
      }
    },

    getFeedback: async (): Promise<FeedbackAnalytics> => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      return {
        ratings: [
          { rating: 1, count: 5 },
          { rating: 2, count: 12 },
          { rating: 3, count: 28 },
          { rating: 4, count: 67 },
          { rating: 5, count: 89 },
        ],
        recentFeedback: [
          {
            id: "feedback-1",
            rating: 5,
            comment: "Very helpful response!",
            date: "2023-06-03",
          },
          {
            id: "feedback-2",
            rating: 4,
            comment: "Good information but could be more detailed.",
            date: "2023-06-02",
          },
        ],
      }
    },
  },
}

export default apiClient
