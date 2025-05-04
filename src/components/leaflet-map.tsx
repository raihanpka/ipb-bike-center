"use client"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

// IPB University coordinates
const IPB_LOCATION = {
  lat: -6.5580310,
  lng: 106.7318160,
}

interface LeafletMapProps {
  className?: string
}

// Create a dynamic import for the Leaflet map component
// This ensures Leaflet is only loaded on the client side
const LeafletMapComponent = dynamic(() => import("./leaflet-map-component").then((mod) => mod.LeafletMapComponent), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted/20">
      <div className="animate-pulse text-sm text-muted-foreground">Loading map...</div>
    </div>
  ),
})

export function LeafletMap({ className }: LeafletMapProps) {
  return <LeafletMapComponent className={className} location={IPB_LOCATION} />
}
