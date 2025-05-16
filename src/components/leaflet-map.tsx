'use client';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// IPB University coordinates
const IPB_LOCATION = {
  lat: -6.558031,
  lng: 106.731816
};

interface LeafletMapProps {
  className?: string;
}

// Create a dynamic import for the Leaflet map component
// This ensures Leaflet is only loaded on the client side
const LeafletMapComponent = dynamic(
  () =>
    import('./leaflet-map-component').then((mod) => mod.LeafletMapComponent),
  {
    ssr: false,
    loading: () => (
      <div className='bg-muted/20 flex h-full w-full items-center justify-center'>
        <div className='text-muted-foreground animate-pulse text-sm'>
          Loading map...
        </div>
      </div>
    )
  }
);

export function LeafletMap({ className }: LeafletMapProps) {
  return <LeafletMapComponent className={className} location={IPB_LOCATION} />;
}
