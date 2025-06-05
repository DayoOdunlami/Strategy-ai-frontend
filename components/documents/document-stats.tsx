"use client"

import { useEffect, useState } from "react"
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DocumentStatsData {
  total: number
  processing: number
  ready: number
  errors: number
}

export function DocumentStats() {
  const [stats, setStats] = useState<DocumentStatsData>({
    total: 0,
    processing: 0,
    ready: 0,
    errors: 0,
  })

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setStats({
      total: 247,
      processing: 3,
      ready: 241,
      errors: 3,
    })
  }, [])

  const statCards = [
    {
      title: "Total Documents",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Processing",
      value: stats.processing,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Ready",
      value: stats.ready,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Errors",
      value: stats.errors,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
