// Demo Mode Configuration
import { useState, useEffect } from 'react'

export interface DemoModeConfig {
  enabled: boolean
  showBanner: boolean
  sampleDataEnabled: boolean
}

// Sample data for demo mode
export const DEMO_DATA = {
  documents: [
    {
      id: "demo-1",
      filename: "Railway_Infrastructure_Strategy_2024.pdf",
      title: "Railway Infrastructure Strategy 2024",
      sector: "Transportation",
      use_case: "Infrastructure Planning",
      status: "ready",
      created_at: "2024-01-15T10:30:00Z",
      metadata: {
        summary: "Comprehensive strategy for UK railway infrastructure development",
        source: "Department for Transport",
        date: "2024-01-15",
        confidence: 0.92
      }
    },
    {
      id: "demo-2", 
      filename: "Smart_Cities_Implementation_Guide.pdf",
      title: "Smart Cities Implementation Guide",
      sector: "Urban Development",
      use_case: "Smart City Planning",
      status: "ready",
      created_at: "2024-01-10T14:20:00Z",
      metadata: {
        summary: "Best practices for implementing smart city technologies",
        source: "Tech City UK",
        date: "2024-01-10",
        confidence: 0.88
      }
    },
    {
      id: "demo-3",
      filename: "Sustainability_Framework_2024.pdf", 
      title: "Sustainability Framework 2024",
      sector: "Environment",
      use_case: "Environmental Planning",
      status: "processing",
      created_at: "2024-01-12T09:15:00Z",
      metadata: {
        summary: "Framework for sustainable development practices",
        source: "Environment Agency",
        date: "2024-01-12",
        confidence: 0.85
      }
    }
  ],

  analytics: {
    totalQueries: 2847,
    totalDocuments: 247,
    activeUsers: 89,
    averageRating: 4.2,
    responseTime: 1.2,
    systemUptime: 99.8
  },

  recentActivity: [
    {
      id: "activity-1",
      type: "document_upload",
      message: "New document uploaded: Railway Infrastructure Strategy 2024",
      timestamp: "2024-01-15T10:30:00Z",
      user: "john.smith@example.com"
    },
    {
      id: "activity-2", 
      type: "query",
      message: "AI query: 'What are the latest sustainability requirements?'",
      timestamp: "2024-01-15T10:25:00Z",
      user: "sarah.jones@example.com"
    },
    {
      id: "activity-3",
      type: "document_processed",
      message: "Document processing completed: Smart Cities Guide",
      timestamp: "2024-01-15T10:20:00Z",
      user: "system"
    }
  ],

  sectorMetrics: {
    Transportation: { documents: 45, queries: 423 },
    "Urban Development": { documents: 32, queries: 298 },
    Environment: { documents: 28, queries: 267 },
    Technology: { documents: 41, queries: 389 },
    Healthcare: { documents: 19, queries: 156 }
  }
}

// Helper to check if we're in browser environment
const isBrowser = typeof window !== 'undefined'

// Demo mode hook with SSR safety
export function useDemoMode() {
  // Default config for SSR (server-side rendering)
  const defaultConfig: DemoModeConfig = {
    enabled: true, // Default to enabled for new users
    showBanner: true,
    sampleDataEnabled: true
  }

  const [config, setConfig] = useState<DemoModeConfig>(defaultConfig)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from localStorage after component mounts (client-side only)
  useEffect(() => {
    if (isBrowser) {
      try {
        const saved = localStorage.getItem('demo-mode-config')
        if (saved) {
          const parsedConfig = JSON.parse(saved)
          setConfig(parsedConfig)
        }
      } catch (error) {
        console.warn('Failed to load demo mode config from localStorage:', error)
        // Keep default config if localStorage fails
      }
      setIsHydrated(true)
    }
  }, [])

  // Save to localStorage when config changes (client-side only)
  useEffect(() => {
    if (isBrowser && isHydrated) {
      try {
        localStorage.setItem('demo-mode-config', JSON.stringify(config))
      } catch (error) {
        console.warn('Failed to save demo mode config to localStorage:', error)
      }
    }
  }, [config, isHydrated])

  const toggleDemoMode = () => {
    setConfig(prev => ({ ...prev, enabled: !prev.enabled }))
  }

  const toggleBanner = () => {
    setConfig(prev => ({ ...prev, showBanner: !prev.showBanner }))
  }

  const enableSampleData = () => {
    setConfig(prev => ({ ...prev, sampleDataEnabled: true }))
  }

  const disableSampleData = () => {
    setConfig(prev => ({ ...prev, sampleDataEnabled: false }))
  }

  return {
    config,
    toggleDemoMode,
    toggleBanner,
    enableSampleData,
    disableSampleData,
    isDemo: config.enabled,
    showBanner: config.showBanner,
    useSampleData: config.enabled && config.sampleDataEnabled,
    isHydrated // Useful for avoiding hydration mismatches
  }
}

// Helper to merge real data with demo data
export function withDemoData<T>(realData: T[], demoData: T[], useDemoMode: boolean): T[] {
  if (useDemoMode) {
    return realData.length === 0 ? demoData : [...realData, ...demoData]
  }
  return realData
} 