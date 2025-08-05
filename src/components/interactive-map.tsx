
'use client';

import { useMemo, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { Skeleton } from './ui/skeleton';

const libraries: ('places')[] = ['places'];

interface Location {
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
    userLocation?: Location | null;
    userAvatar?: string;
}

export function InteractiveMap({ userLocation, userAvatar }: InteractiveMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const defaultCenter = useMemo(() => ({ lat: 38.6582, lng: -77.2497 }), []);

  useEffect(() => {
    if (userLocation && mapRef.current) {
        mapRef.current.panTo(userLocation);
        mapRef.current.setZoom(15);
    }
  }, [userLocation]);


  if (loadError) {
    return <div>Error loading maps. Please check the API key.</div>;
  }

  if (!isLoaded) {
    return <Skeleton className="w-full h-full" />;
  }

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
      }}
    >
      {userLocation && (
        <MarkerF
            position={userLocation}
            icon={userAvatar ? {
                url: userAvatar,
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20),
            } : undefined}
            options={{
              zIndex: 999, // Render user marker above others
            }}
        />
      )}
    </GoogleMap>
  );
}
