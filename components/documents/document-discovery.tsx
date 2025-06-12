"use client"

import { useState, useEffect } from "react"
import { Search, Filter, FileText, Calendar, Tag, Eye, Grid, List, Edit2, Check, X, Download, Upload, Trash2, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

type ViewMode = "cards" | "table"

interface EditingState {
  [docId: string]: {
    [field: string]: boolean
  }
}

export function DocumentDiscovery() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSector, setSelectedSector] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [viewMode, setViewMode] = useState<ViewMode>("cards")
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set())
  const [editingState, setEditingState] = useState<EditingState>({})
  const [bulkEditMode, setBulkEditMode] = useState(false)
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocs(new Set(documents.map(doc => doc.id)))
    } else {
      setSelectedDocs(new Set())
    }
  }

  const handleSelectDoc = (docId: string, checked: boolean) => {
    const newSelected = new Set(selectedDocs)
    if (checked) {
      newSelected.add(docId)
    } else {
      newSelected.delete(docId)
    }
    setSelectedDocs(newSelected)
  }

  const startEditing = (docId: string, field: string) => {
    setEditingState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: true
      }
    }))
  }

  const stopEditing = (docId: string, field: string) => {
    setEditingState(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        [field]: false
      }
    }))
  }

  const saveFieldEdit = async (docId: string, field: string, value: string) => {
    try {
      // Update local state immediately for responsiveness
      setDocuments(prev => prev.map(doc => 
        doc.id === docId ? { ...doc, [field]: value } : doc
      ))
      
      // TODO: Make API call to update document
      // await apiClient.documents.update(docId, { [field]: value })
      
      stopEditing(docId, field)
      console.log(`Updated ${field} for doc ${docId} to: ${value}`)
    } catch (error) {
      console.error("Failed to update document:", error)
      // Revert on error
      loadDocuments()
    }
  }

  const handleBulkAction = async (action: string) => {
    const selectedIds = Array.from(selectedDocs)
    console.log(`Bulk action: ${action} on docs:`, selectedIds)
    
    // TODO: Implement bulk actions
    switch (action) {
      case "delete":
        // Bulk delete
        break
      case "export":
        // Export selected documents to CSV
        break
      case "change-sector":
        // Show bulk edit modal
        setBulkEditMode(true)
        break
    }
  }

  const EditableCell = ({ 
    docId, 
    field, 
    value, 
    type = "text" 
  }: { 
    docId: string
    field: string
    value: string
    type?: "text" | "select"
  }) => {
    const isEditing = editingState[docId]?.[field]
    const [editValue, setEditValue] = useState(value)

    if (!isEditing) {
      return (
        <div 
          className="cursor-pointer hover:bg-muted p-1 rounded"
          onClick={() => startEditing(docId, field)}
        >
          {value || "—"}
          <Edit2 className="inline ml-2 h-3 w-3 opacity-50" />
        </div>
      )
    }

    if (type === "select" && field === "sector") {
      return (
        <div className="flex items-center gap-2">
          <Select value={editValue} onValueChange={setEditValue}>
            <SelectTrigger className="h-8 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rail">Rail</SelectItem>
              <SelectItem value="maritime">Maritime</SelectItem>
              <SelectItem value="highways">Highways</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => saveFieldEdit(docId, field, editValue)}
          >
            <Check className="h-3 w-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => stopEditing(docId, field)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="h-8 w-48"
          onBlur={() => saveFieldEdit(docId, field, editValue)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              saveFieldEdit(docId, field, editValue)
            } else if (e.key === "Escape") {
              stopEditing(docId, field)
              setEditValue(value)
            }
          }}
          autoFocus
        />
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => saveFieldEdit(docId, field, editValue)}
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={() => stopEditing(docId, field)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Mode Indicator */}
      {useSampleData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            🔍 <strong>Demo Mode:</strong> Displaying sample search results with live editing
          </p>
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Discover Documents</h1>
          <p className="text-muted-foreground">Find and explore your strategic documents with enhanced search</p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
          >
            <Grid className="h-4 w-4 mr-2" />
            Cards
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
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

              {/* Enable Live Editing */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="live-editing" 
                  checked={viewMode === "table"} 
                  onCheckedChange={(checked) => setViewMode(checked ? "table" : "cards")}
                />
                <label htmlFor="live-editing" className="text-sm font-medium">
                  Enable Live Editing
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedDocs.size > 0 && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedDocs.size} document{selectedDocs.size !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("export")}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("change-sector")}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Bulk Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("delete")}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedDocs(new Set())}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
            </div>
            
            {/* Table View */}
            {viewMode === "table" ? (
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedDocs.size === documents.length}
                            indeterminate={selectedDocs.size > 0 && selectedDocs.size < documents.length}
                            onCheckedChange={handleSelectAll}
                          />
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Sector</TableHead>
                        <TableHead>Use Case</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Chunks</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedDocs.has(doc.id)}
                              onCheckedChange={(checked) => handleSelectDoc(doc.id, checked as boolean)}
                            />
                          </TableCell>
                          <TableCell className="font-medium max-w-64">
                            <EditableCell
                              docId={doc.id}
                              field="title"
                              value={doc.title}
                            />
                          </TableCell>
                          <TableCell>
                            <EditableCell
                              docId={doc.id}
                              field="sector"
                              value={doc.sector}
                              type="select"
                            />
                          </TableCell>
                          <TableCell>
                            <EditableCell
                              docId={doc.id}
                              field="use_case"
                              value={doc.use_case || "—"}
                            />
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(doc.status)}
                          </TableCell>
                          <TableCell>
                            {new Date(doc.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {doc.chunk_count}
                          </TableCell>
                          <TableCell className="max-w-48">
                            <EditableCell
                              docId={doc.id}
                              field="tags"
                              value={doc.tags || ""}
                            />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <FileText className="h-4 w-4 mr-2" />
                                  View Chunks
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              /* Card View */
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Checkbox
                            checked={selectedDocs.has(doc.id)}
                            onCheckedChange={(checked) => handleSelectDoc(doc.id, checked as boolean)}
                          />
                          <CardTitle className="text-base leading-tight">
                            {doc.title}
                          </CardTitle>
                        </div>
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
            )}
          </>
        )}
      </div>
    </div>
  )
} 