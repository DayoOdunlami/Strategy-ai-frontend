"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MergedGeoInsights } from "@/components/geo-insights/merged-geo-insights"
import { ContextualChat } from "@/components/chat/contextual-chat"

export default function GeoInsightsPage() {
  return (
    <DashboardLayout>
      <MergedGeoInsights />
      <ContextualChat context="insights" />
    </DashboardLayout>
  )
} 