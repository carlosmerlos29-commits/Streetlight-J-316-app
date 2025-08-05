
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
    }
  }, [userLocation]);

  const customMarkerIcon = useMemo(() => {
    if (!userAvatar) return undefined;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="#A34BFF" stroke="#FFFFFF" stroke-width="2"/>
        <clipPath id="clip">
          <circle cx="24" cy="24" r="20"/>
        </clipPath>
        <image
          href="${userAvatar}"
          x="4" y="4" width="40" height="40"
          clip-path="url(#clip)"
          crossorigin="anonymous"
        />
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new google.maps.Size(48, 48),
      anchor: new google.maps.Point(24, 24),
    };
  }, [userAvatar]);


  if (loadError) {
    return <div>Error loading maps. Please check the API key.</div>;
  }

  if (!isLoaded) {
    return <Skeleton className="w-full h-full" />;
  }

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
      {userLocation && customMarkerIcon && (
        <Marker
          position={userLocation}
          icon={customMarkerIcon}
        />
      )}
    </GoogleMap>
  );
}
