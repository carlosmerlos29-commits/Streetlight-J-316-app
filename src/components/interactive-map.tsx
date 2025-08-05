
'use client';

import { useEffect, useRef, useMemo } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  GoogleMap,
  OverlayView,
  MarkerF,
} from '@react-google-maps/api';
import { Skeleton } from './ui/skeleton';
import { Flame, Hourglass } from 'lucide-react';

interface Location { lat: number; lng: number; }

export interface EventLocation extends Location {
    id: string;
    title: string;
    isLive: boolean;
}

interface InteractiveMapProps {
  isLoaded: boolean;
  loadError?: Error;
  userLocation?: Location | null;
  userAvatar?: string;
  userName?: string;
  events?: EventLocation[];
}

const createMarkerIcon = (isLive: boolean) => {
  const pinColor = isLive ? 'hsl(var(--destructive))' : 'hsl(var(--primary))';
  const iconColor = 'white';
  
  const icon = isLive ? <Flame size={16} color={iconColor} /> : <Hourglass size={16} color={iconColor} />;

  const markerSvg = renderToStaticMarkup(
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 0C11.16 0 4 7.16 4 16c0 8.84 16 24 16 24s16-15.16 16-24C36 7.16 28.84 0 20 0Z" fill={pinColor}/>
      <foreignObject x="12" y="8" width="16" height="16">
        <div xmlns="http://www.w3.org/1999/xhtml">
          {icon}
        </div>
      </foreignObject>
    </svg>
  );
    
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(markerSvg)}`,
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 40),
  };
};


export function InteractiveMap({
  isLoaded,
  loadError,
  userLocation,
  userAvatar,
  userName,
  events = [],
}: InteractiveMapProps) {
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
      center={defaultCenter}
      zoom={10}
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
                border: '2px solid hsl(var(--primary))',
              }}
              data-ai-hint="person portrait"
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'hsl(var(--foreground))',
                background: 'hsl(var(--background))',
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

      {events.map((event) => (
         <MarkerF
            key={event.id}
            position={{ lat: event.lat, lng: event.lng }}
            title={event.title}
            icon={isLoaded ? createMarkerIcon(event.isLive) : undefined}
          />
      ))}
    </GoogleMap>
  );
}
