"use client"

import React, { useState } from "react"
import { Map, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RailwayMapApiClean } from "@/components/map/railway-map-api-clean"

export function MergedGeoInsightsApiClean() {
  const [selectedRegion, setSelectedRegion] = useState<any>(null)

  const handleRegionSelect = (regionInfo: any) => {
    setSelectedRegion(regionInfo)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🚂 Geospatial Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Interactive railway map with live API data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Map Panel */}
        <Card className="lg:col-span-3 overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="flex items-center text-lg font-semibold">
                  <Map className="mr-2 h-5 w-5 text-blue-600" />
                  🗺️ Railway Regions (Live API Data)
                </span>
                <span className="text-sm text-muted-foreground font-normal ml-7">
                  Click regions to see real Supabase data
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto transition-all duration-300">
              <RailwayMapApiClean 
                height={700} 
                onRegionSelect={handleRegionSelect}
              />
            </div>
          </CardContent>
        </Card>

        {/* Info Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Region Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedRegion ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary">
                    {selectedRegion.region.name} ({selectedRegion.region.code})
                  </h3>
                  <p className="text-muted-foreground">
                    Director: {selectedRegion.region.director}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-700">Route Miles</p>
                    <p className="text-2xl font-bold text-green-800">
                      {selectedRegion.region.route_miles.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">Stations</p>
                    <p className="text-2xl font-bold text-blue-800">
                      {selectedRegion.region.stations}
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-sm text-orange-700">CPC Projects</p>
                    <p className="text-2xl font-bold text-orange-800">
                      {selectedRegion.region.cpc_projects}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Description</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRegion.region.description}
                  </p>
                </div>

                {selectedRegion.clickedDistrict && (
                  <div>
                    <p className="text-sm font-medium">Clicked Area</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRegion.clickedDistrict.name}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Click on a region to see live API data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 