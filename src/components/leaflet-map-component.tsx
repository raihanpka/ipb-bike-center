"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

// Fix for Leaflet marker icon in Next.js
const fixLeafletIcon = () => {
  // Only run on client side
  if (typeof window !== "undefined") {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    })
  }
}

interface LeafletMapComponentProps {
  className?: string
  location: {
    lat: number
    lng: number
  }
}

import { useMapEvent } from "react-leaflet"

function MapClickHandler() {
  useMapEvent("click", () => {
    window.open("https://maps.app.goo.gl/Y3j5fAAxf9g5s1yS9", "_blank")
  })
  return null
}

export function LeafletMapComponent({ className, location }: LeafletMapComponentProps) {
  const mapRef = useRef<L.Map>(null)

  useEffect(() => {
    fixLeafletIcon()
  }, [])

  return (
    <div className={className} style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        attributionControl={false}
        // @ts-ignore - ref type issue with Leaflet
        ref={mapRef}
      >
        <MapClickHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            <div className="p-1">
              <h3 className="font-medium text-sm">IPB Bike Shelter</h3>
              <p className="text-xs">Kampus IPB Dramaga, Bogor</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
