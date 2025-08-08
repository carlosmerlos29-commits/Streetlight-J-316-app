

'use client';

import { useEffect, useRef, useMemo } from 'react';
import {
  GoogleMap,
  MarkerF,
} from '@react-google-maps/api';
import { Skeleton } from './ui/skeleton';

interface Location { lat: number; lng: number; }

export interface EventLocation extends Location {
  id: string;
}

interface InteractiveMapProps {
  isLoaded: boolean;
  loadError?: Error;
  eventLocations?: EventLocation[];
  userLocation?: Location | null;
}


export function InteractiveMap({
  isLoaded,
  loadError,
  eventLocations = [],
  userLocation,
}: InteractiveMapProps) {
  const mapRef = useRef<google.maps.Map|null>(null);
  const defaultCenter = useMemo<Location>(
    () => ({ lat: 38.8315, lng: -77.3061 }),
    []
  );

  useEffect(() => {
    if (userLocation && mapRef.current) {
        mapRef.current.panTo(userLocation);
    }
  }, [userLocation]);

  if (loadError) return <div>Error loading maps.</div>;
  if (!isLoaded) return <Skeleton className="w-full h-full" />;

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={defaultCenter}
      zoom={12}
      onLoad={(map) => { mapRef.current = map; }}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        scrollwheel: true,
        mapId: 'fa151a7458f4a180',
      }}
    >
      {eventLocations.map(location => (
        <MarkerF key={location.id} position={{ lat: location.lat, lng: location.lng }} />
      ))}
      {userLocation && (
         <MarkerF 
            position={userLocation}
            icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "hsl(var(--primary))",
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 2,
            }}
         />
      )}
    </GoogleMap>
  );
}
