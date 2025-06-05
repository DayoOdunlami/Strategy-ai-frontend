"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import { MetricsOverview } from "@/components/analytics/metrics-overview"
import { QueryAnalytics } from "@/components/analytics/query-analytics"
import { DocumentAnalytics } from "@/components/analytics/document-analytics"
import { FeedbackAnalytics } from "@/components/analytics/feedback-analytics"
import { SectorPerformance } from "@/components/analytics/sector-performance"
import { SystemHealth } from "@/components/analytics/system-health"
import { RecentActivity } from "@/components/analytics/recent-activity"
import apiClient from "@/lib/api-client"

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d")
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const [systemAnalytics, feedbackAnalytics] = await Promise.all([
        apiClient.admin.getAnalytics(),
        apiClient.admin.getFeedback(),
      ])

      setAnalytics({
        system: systemAnalytics,
        feedback: feedbackAnalytics,
      })
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    // Implement analytics export
    console.log("Exporting analytics data...")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">System performance and user insights for Strategy AI</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadAnalytics}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <MetricsOverview timeRange={timeRange} />

      <div className="grid gap-6 lg:grid-cols-2">
        <QueryAnalytics timeRange={timeRange} />
        <DocumentAnalytics timeRange={timeRange} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <FeedbackAnalytics analytics={analytics?.feedback} />
        <SectorPerformance timeRange={timeRange} />
        <SystemHealth />
      </div>

      <RecentActivity />
    </div>
  )
}
