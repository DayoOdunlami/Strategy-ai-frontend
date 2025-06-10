import { useState, useEffect } from 'react'

interface BackendRegion {
  code: string
  name: string
  director: string
  route_miles: number
  stations: number
  cpc_projects: number
}

interface RailwayRegion {
  id: string
  name: string
  color: string
  routes: string[]
  description: string
  stations: number
  projects: number
  director?: string
  route_miles?: number
}

export function useRegionalData() {
  const [regions, setRegions] = useState<RailwayRegion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Keep your existing region colors and routes
  const regionConfig = {
    'ER': {
      color: '#FF8C00',
      routes: ['North and East route', 'East Midlands route', 'Anglia route'],
      description: 'Covering East England including major routes to Cambridge, Norwich, and the East Midlands'
    },
    'SC': {
      color: '#4169E1', 
      routes: ['Scotland route'],
      description: 'Scottish railway network including connections to Edinburgh, Glasgow, and Highland routes'
    },
    'WR': {
      color: '#DA70D6',
      routes: ['Western route'],
      description: 'Western England including routes to Wales, Cardiff, Swansea'
    },
    'NR': {
      color: '#32CD32',
      routes: ['Northern route', 'North West route'],
      description: 'Northern England routes including connections to Manchester, Liverpool'
    },
    'SR': {
      color: '#20B2AA',
      routes: ['Kent route', 'Sussex route', 'Wessex route'],
      description: 'South England routes including connections to Brighton, Dover, and South West'
    }
  }

  useEffect(() => {
    fetchRegionalData()
  }, [])

  const fetchRegionalData = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://web-production-6045b.up.railway.app/api/regions')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch regions: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Map backend data to your existing region format
      const mappedRegions: RailwayRegion[] = data.regions.map((region: BackendRegion) => {
        const config = regionConfig[region.code as keyof typeof regionConfig]
        
        return {
          id: region.code.toLowerCase(),
          name: `${region.name} Region`,
          color: config?.color || '#666666',
          routes: config?.routes || ['Regional routes'],
          description: config?.description || `${region.name} railway network`,
          stations: region.stations,
          projects: region.cpc_projects,
          director: region.director,
          route_miles: region.route_miles
        }
      })
      
      setRegions(mappedRegions)
      setError(null)
    } catch (err) {
      console.error('Error fetching regional data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load regional data')
      
      // Fallback to original mock data if API fails
      setRegions([
        {
          id: "eastern",
          name: "Eastern Region",
          color: "#FF8C00",
          routes: ["North and East route", "East Midlands route", "Anglia route"],
          description: "Covering East England including major routes to Cambridge, Norwich, and the East Midlands",
          stations: 245,
          projects: 12,
        },
        {
          id: "north-west-central",
          name: "North West & Central Region",
          color: "#32CD32",
          routes: ["North West route", "Central route", "West Coast route"],
          description: "Major routes including West Coast Main Line and connections to Manchester, Liverpool",
          stations: 312,
          projects: 18,
        },
        {
          id: "scotland",
          name: "Scotland Region",
          color: "#4169E1",
          routes: ["Scotland route"],
          description: "Scottish railway network including connections to Edinburgh, Glasgow, and Highland routes",
          stations: 189,
          projects: 8,
        },
        {
          id: "southern",
          name: "Southern Region",
          color: "#20B2AA",
          routes: ["Kent route", "Sussex route", "Wessex route", "Western route"],
          description: "South England routes including connections to Brighton, Dover, and South West",
          stations: 428,
          projects: 22,
        },
        {
          id: "wales-western",
          name: "Wales and Western Region",
          color: "#DA70D6",
          routes: ["Wales route", "Western route"],
          description: "Welsh railway network and Western England including routes to Cardiff, Swansea",
          stations: 156,
          projects: 9,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return { regions, loading, error, refetch: fetchRegionalData }
} 