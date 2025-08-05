
'use client';

import { useEffect, useRef, useMemo } from 'react';
import {
  GoogleMap,
  OverlayView,
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
      defaultCenter={defaultCenter}
      defaultZoom={12}
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
            x: -width / 2,
            y: -height,
          })}
        >
          <div className="flex items-center gap-2">
            <img
              src={userAvatar}
              alt={userName}
              className="w-10 h-10 rounded-full border-2 border-primary"
              data-ai-hint="person portrait"
            />
            <span
              className="text-sm font-medium text-foreground bg-background px-1.5 py-0.5 rounded shadow-lg"
            >
              {userName}
            </span>
          </div>
        </OverlayView>
      )}

      {events.map((evt) => (
        <OverlayView
          key={evt.id}
          position={{ lat: evt.lat, lng: evt.lng }}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          getPixelPositionOffset={({ width, height }) => ({
            x: -width / 2,
            y: -height,
          })}
        >
          <div
            className="bg-white rounded-full p-1 shadow-md"
            title={evt.title}
          >
            {evt.isLive ? (
              <Flame className="h-6 w-6 text-destructive" />
            ) : (
              <Hourglass className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
        </OverlayView>
      ))}
    </GoogleMap>
  );
}
