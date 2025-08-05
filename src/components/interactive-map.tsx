
'use client';

import { useMemo, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, OverlayViewF } from '@react-google-maps/api';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

const libraries: ('places')[] = ['places'];

interface Location {
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
    userLocation?: Location | null;
    userAvatar?: string;
    userName?: string;
}

export function InteractiveMap({ userLocation, userAvatar, userName }: InteractiveMapProps) {
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
      {userLocation && isLoaded && (
        <OverlayViewF
            position={userLocation}
            mapPaneName={OverlayViewF.OVERLAY_MOUSE_TARGET}
        >
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 p-1 bg-background rounded-full shadow-lg border border-primary">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={userAvatar} alt={userName || 'User'} />
                        <AvatarFallback>{userName?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold pr-3">{userName}</span>
                </div>
                <div className="w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-primary -mt-1"></div>
            </div>
        </OverlayViewF>
      )}
    </GoogleMap>
  );
}
