
'use client';

import { useEffect, useRef, useMemo } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  OverlayView,
  MarkerF,
} from '@react-google-maps/api';
import { Skeleton } from './ui/skeleton';
import { Flame, CalendarDays } from 'lucide-react';

const libraries = ['places'] as const;

interface Location { lat: number; lng: number; }

export interface EventLocation extends Location {
    id: string;
    title: string;
    isLive: boolean;
}

interface InteractiveMapProps {
  userLocation?: Location | null;
  userAvatar?: string;
  userName?: string;
  events?: EventLocation[];
}

const createMarkerIcon = (isLive: boolean) => {
  const Icon = isLive ? Flame : CalendarDays;
  const color = isLive ? 'hsl(var(--destructive))' : 'hsl(var(--primary))';
  const iconMarkup = `<${Icon.displayName} xmlns="http://www.w3.org/1999/xhtml" class="w-full h-full text-white" />`;

  const svg = `
    <svg width="40" height="40" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      <foreignObject x="5" y="4" width="14" height="14">
        ${iconMarkup.replace(/<([a-zA-Z]+)([^>]+?)\/>/g, `<div $2></div>`)}
      </foreignObject>
    </svg>`;
    
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 40),
  };
};


export function InteractiveMap({
  userLocation,
  userAvatar,
  userName,
  events = [],
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
