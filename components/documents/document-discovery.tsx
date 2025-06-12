"use client"

import { useState, useEffect } from "react"
import { Search, Filter, FileText, Calendar, Tag, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import apiClient, { type Sector } from "@/lib/api-client"
import { useDemoMode, DEMO_DATA } from "@/lib/demo-mode"

interface Document {
  id: string
  title: string
  filename?: string
  sector: string
  use_case?: string
  tags?: string
  source_type: string
  status: string
  chunk_count: number
  created_at: string
  updated_at: string
}

export function DocumentDiscovery() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const { useSampleData } = useDemoMode()

  useEffect(() => {
    loadDocuments()
  }, [searchQuery, selectedSector, sortBy, useSampleData])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      if (useSampleData) {
        // Use demo data
        setTimeout(() => {
          let filteredDocs = DEMO_DATA.documents.map(doc => ({
            id: doc.id,
            title: doc.title,
            filename: doc.filename,
            sector: doc.sector,
            use_case: doc.use_case,
            tags: doc.tags,
            source_type: doc.source_type,
            status: doc.status,
            chunk_count: doc.chunk_count,
            created_at: doc.created_at,
            updated_at: doc.updated_at
          }))
          
          // Apply search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filteredDocs = filteredDocs.filter(doc =>
              doc.title.toLowerCase().includes(query) ||
              doc.tags.toLowerCase().includes(query) ||
              doc.sector.toLowerCase().includes(query)
            )
          }
          
          // Apply sector filter
          if (selectedSector !== "all") {
            filteredDocs = filteredDocs.filter(doc => 
              doc.sector.toLowerCase() === selectedSector.toLowerCase()
            )
          }
          
          // Apply sorting
          if (sortBy === "recent") {
            filteredDocs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          } else if (sortBy === "title") {
            filteredDocs.sort((a, b) => a.title.localeCompare(b.title))
          }
          
          setDocuments(filteredDocs)
          setLoading(false)
        }, 300)
      } else {
        // Use real API
        const response = await apiClient.documents.list({
          search: searchQuery,
          sector: selectedSector !== "all" ? selectedSector : undefined,
          limit: 50
        })
        
        let docs = response.documents || []
        
        // Apply sorting
        if (sortBy === "recent") {
          docs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        } else if (sortBy === "title") {
          docs.sort((a, b) => a.title.localeCompare(b.title))
        }
        
        setDocuments(docs)
        setLoading(false)
      }
    } catch (error) {
      console.error("Failed to load documents:", error)
      setLoading(false)
    }
  }

  const getSectorBadge = (sector: string) => {
    const colors = {
      rail: "bg-blue-100 text-blue-800",
      maritime: "bg-cyan-100 text-cyan-800", 
      highways: "bg-orange-100 text-orange-800",
      general: "bg-gray-100 text-gray-800",
    }
    
    const colorClass = colors[sector.toLowerCase() as keyof typeof colors] || colors.general
    
    return (
      <Badge variant="outline" className={colorClass}>
        {sector}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      ready: "bg-green-100 text-green-800",
      processing: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800"
    }
    
    const colorClass = colors[status.toLowerCase() as keyof typeof colors] || colors.processing
    
    return (
      <Badge variant="outline" className={colorClass}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Mode Indicator */}
      {useSampleData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            🔍 <strong>Demo Mode:</strong> Displaying sample search results
          </p>
        </div>
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Discover Documents</h1>
        <p className="text-muted-foreground">Find and explore your strategic documents with enhanced search</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents, tags, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={selectedSector} onValueChange={setSelectedSector}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Sectors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  <SelectItem value="rail">Rail</SelectItem>
                  <SelectItem value="maritime">Maritime</SelectItem>
                  <SelectItem value="highways">Highways</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="relevance">Relevance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Searching documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No documents found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms or filters" : "No documents available"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results Count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Found {documents.length} document{documents.length !== 1 ? 's' : ''}
                {searchQuery && ` for "${searchQuery}"`}
              </p>
            </div>
            
            {/* Document Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base leading-tight">
                        {doc.title}
                      </CardTitle>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2">
                        {getSectorBadge(doc.sector)}
                        {getStatusBadge(doc.status)}
                      </div>
                      
                      {/* Document Info */}
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {doc.filename && (
                          <div className="flex items-center gap-2">
                            <FileText className="h-3 w-3" />
                            <span className="truncate">{doc.filename}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                        </div>
                        {doc.chunk_count && (
                          <div className="flex items-center gap-2">
                            <Tag className="h-3 w-3" />
                            <span>{doc.chunk_count} sections</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Tags */}
                      {doc.tags && (
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.split(',').slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
} 