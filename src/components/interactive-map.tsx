
'use client';

import { useMemo, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
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

  const defaultCenter = useMemo(() => ({ lat: 40.7128, lng: -74.0060 }), []);

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

  const markerIcon = userLocation && userAvatar ? {
    path: 'M 0, 0 m -15, 0 a 15,15 0 1,0 30,0 a 15,15 0 1,0 -30,0',
    fillColor: '#ffffff',
    fillOpacity: 1,
    strokeColor: 'hsl(var(--primary))',
    strokeWeight: 2,
    anchor: new google.maps.Point(0, 0),
    labelOrigin: new google.maps.Point(0,0),
  } : undefined;

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      center={userLocation || defaultCenter}
      zoom={userLocation ? 15 : 12}
      onLoad={(map) => { mapRef.current = map; }}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        scrollwheel: true,
        mapId: 'fa151a7458f4a180',
      }}
    >
      {userLocation && userAvatar && (
        <>
            <Marker
                position={userLocation}
                icon={{
                    url: userAvatar,
                    scaledSize: new google.maps.Size(40, 40),
                    anchor: new google.maps.Point(20, 20),
                }}
                shape={{
                    coords: [20, 20, 20],
                    type: "circle",
                }}
            />
        </>
      )}
    </GoogleMap>
  );
}
