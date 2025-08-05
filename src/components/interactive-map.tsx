
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
      }}
    >
      {userLocation && (
        <MarkerF
            position={userLocation}
            icon={userAvatar ? {
                url: userAvatar,
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40),
                // The following properties are not standard for image icons but are often used in custom solutions.
                // For `@react-google-maps/api` we can achieve a circle by using a data URI of a circular image or by overlaying.
                // However, a simpler approach is to apply styles if the component allows. Let's create a proper circular icon.
                // A better way is to use the `path` for a symbol and style it, but that doesn't allow for an image inside.
                // The best way is to use an icon object that styles the image.
                // The `url` will be the user's avatar. We'll make it circular via styling.
                // Let's create a marker icon that is a circle with the user's image.
                // A common technique is to use advanced markers or custom overlays.
                // With MarkerF, we can provide a symbol. Let's try the proper way with an Icon object.
                 path: google.maps.SymbolPath.CIRCLE,
                 scale: 20, // size of the circle
                 fillColor: "white",
                 fillOpacity: 1,
                 strokeWeight: 2,
                 strokeColor: 'white', // border color
            } : undefined}
        >
             {/* A second marker for the image itself, placed on top */}
             <MarkerF 
                position={userLocation}
                icon={userAvatar ? {
                    url: userAvatar,
                    scaledSize: new google.maps.Size(36, 36),
                    anchor: new google.maps.Point(18, 18),
                } : undefined}
                options={{
                    zIndex: 1000 // Image on top of the circle
                }}
             />
        </MarkerF>
      )}

      {userLocation && (
          <MarkerF
            position={userLocation}
            icon={userAvatar ? {
                url: userAvatar,
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20),
            } : {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#4285F4",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff"
            }}
             options={{
                 // This creates a "halo" effect for the border by layering two markers
                icon: userAvatar ? {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 15,
                    fillColor: "white",
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                    anchor: new google.maps.Point(0,0),
                } : undefined,
                 zIndex: 998
             }}
          >
              <MarkerF 
                 position={userLocation}
                 icon={userAvatar ? {
                     url: userAvatar,
                     scaledSize: new google.maps.Size(28, 28),
                     anchor: new google.maps.Point(14, 14),
                 } : undefined}
                 options={{
                     zIndex: 999
                 }}
              />
          </MarkerF>
      )}
    </GoogleMap>
  );
}
