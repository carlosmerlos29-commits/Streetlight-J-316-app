'use client';

import { useEffect, useRef, useMemo } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  OverlayView,
} from '@react-google-maps/api';
import { Skeleton } from './ui/skeleton';

const libraries = ['places'] as const;

interface Location { lat: number; lng: number; }

interface InteractiveMapProps {
  userLocation?: Location | null;
  userAvatar?: string;
  userName?: string;
}

export function InteractiveMap({
  userLocation,
  userAvatar,
  userName,
}: InteractiveMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const mapRef = useRef<google.maps.Map|null>(null);
  const defaultCenter = useMemo<Location>(
    () => ({ lat: 38.8315, lng: -77.3061 }),
    []
  );

  // Pan only once when userLocation changes:
  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.panTo(userLocation);
      mapRef.current.setZoom(15);
    }
  }, [userLocation]);

  if (loadError) return <div>Error loading maps.</div>;
  if (!isLoaded) return <Skeleton className="w-full h-full" />;

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full"
      // UNCONTROLLED: use defaultCenter/Zoom only
      defaultCenter={defaultCenter}
      defaultZoom={10}
      onLoad={(map) => { mapRef.current = map; }}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
fullscreenControl: false,
        scrollwheel: true,
        mapId: 'fa151a7458f4a180',
      }}
    >
      {userLocation && (
        <OverlayView
          position={userLocation}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={({ width, height }) => ({
            x: -width / 2,    // bottom-center alignment
            y: -height,
          })}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src={userAvatar}
              alt={userName}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '2px solid #A34BFF',
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#333',
                background: 'white',
                padding: '2px 6px',
                borderRadius: 4,
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
            >
              {userName}
            </span>
          </div>
        </OverlayView>
      )}
    </GoogleMap>
  );
}