"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Expand, ListCollapseIcon as Collapse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HierarchicalDomainView } from "@/components/domains/hierarchical-domain-view"
import { DomainCreationDialog } from "@/components/domains/domain-creation-dialog"

export function DomainManagement() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["overview"]))
  const [allExpanded, setAllExpanded] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  const toggleAllSections = () => {
    if (allExpanded) {
      setExpandedSections(new Set())
      setAllExpanded(false)
    } else {
      // Expand all sections - this would need to be dynamic based on actual data
      setExpandedSections(new Set(["overview", "domains", "ai", "rail", "highway", "maritime"]))
      setAllExpanded(true)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Domain Management</h1>
          <p className="text-muted-foreground">
            Manage domains, use cases, and AI prompt templates in a hierarchical structure
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={toggleAllSections}>
            {allExpanded ? (
              <>
                <Collapse className="mr-2 h-4 w-4" />
                Collapse All
              </>
            ) : (
              <>
                <Expand className="mr-2 h-4 w-4" />
                Expand All
              </>
            )}
          </Button>
          <DomainCreationDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
        </div>
      </div>

      {/* Overview Statistics */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("overview")}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {expandedSections.has("overview") ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
              System Overview
            </CardTitle>
            <Badge variant="secondary">4 Domains</Badge>
          </div>
        </CardHeader>
        {expandedSections.has("overview") && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Active Domains</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">18</div>
                <div className="text-sm text-muted-foreground">Use Cases</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">24</div>
                <div className="text-sm text-muted-foreground">Prompt Templates</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">156</div>
                <div className="text-sm text-muted-foreground">Auto-Generated Tags</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Hierarchical Domain View */}
      <HierarchicalDomainView
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
        allExpanded={allExpanded}
      />
    </div>
  )
}
