"use client"

import { GeoInsightProvider } from '@/components/geo-insights/geo-insight-provider'
import { UnifiedDashboard } from '@/components/geo-insights/unified-dashboard'

export default function GeoInsightsPage() {
  return (
    <GeoInsightProvider>
      <div className="min-h-screen bg-gray-50">
        <UnifiedDashboard />
      </div>
    </GeoInsightProvider>
  )
} 