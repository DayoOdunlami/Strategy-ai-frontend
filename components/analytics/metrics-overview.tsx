"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, MessageSquare, FileText, Users, Star } from "lucide-react"

interface MetricsOverviewProps {
  timeRange: string
  analytics?: any
}

export function MetricsOverview({ timeRange, analytics }: MetricsOverviewProps) {
  // Use provided analytics data or fallback to static data
  const metricsData = analytics || {
    totalQueries: 2847,
    totalDocuments: 247,
    activeUsers: 89,
    averageRating: 4.2,
    responseTime: 1.2,
    systemUptime: 99.8
  }

  const metrics = [
    {
      title: "AI Queries",
      value: metricsData.totalQueries?.toLocaleString() || "2,847",
      change: "+23%",
      trend: "up",
      icon: MessageSquare,
      description: "Total AI queries processed",
    },
    {
      title: "Documents Processed",
      value: metricsData.totalDocuments?.toLocaleString() || "247",
      change: "+12%",
      trend: "up",
      icon: FileText,
      description: "Documents uploaded and indexed",
    },
    {
      title: "Active Users",
      value: metricsData.activeUsers?.toLocaleString() || "89",
      change: "+8%",
      trend: "up",
      icon: Users,
      description: "Unique users this period",
    },
    {
      title: "Avg Response Rating",
      value: metricsData.averageRating?.toFixed(1) || "4.2",
      change: "+0.3",
      trend: "up",
      icon: Star,
      description: "Average user satisfaction rating",
    },
    {
      title: "Response Time",
      value: `${metricsData.responseTime?.toFixed(1) || "1.2"}s`,
      change: "-0.3s",
      trend: "up",
      icon: TrendingUp,
      description: "Average AI response time",
    },
    {
      title: "System Uptime",
      value: `${metricsData.systemUptime?.toFixed(1) || "99.8"}%`,
      change: "stable",
      trend: "stable",
      icon: TrendingUp,
      description: "System availability",
    },
  ]

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
    return <div className="h-4 w-4" />
  }

  const getTrendColor = (trend: string) => {
    if (trend === "up") return "text-green-600"
    if (trend === "down") return "text-red-600"
    return "text-muted-foreground"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center gap-1 text-xs">
              {getTrendIcon(metric.trend)}
              <span className={getTrendColor(metric.trend)}>{metric.change}</span>
              <span className="text-muted-foreground">from last period</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
