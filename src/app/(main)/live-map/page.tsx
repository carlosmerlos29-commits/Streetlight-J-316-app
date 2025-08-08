
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAuth, User } from 'firebase/auth';
import { useJsApiLoader } from '@react-google-maps/api';

import { app } from '@/lib/firebase';
import { InteractiveMap, EventLocation } from '@/components/interactive-map';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ListFilter, RadioTower, LocateFixed, Loader2, PlusCircle, Flame } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useEvents } from '@/app/(main)/layout';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';


interface Location {
  lat: number;
  lng: number;
}

// Mock geocoded locations for demo purposes
const eventCoordinates: { [key: string]: Location } = {
    '4110 Chain Bridge Rd, Fairfax, VA 22030': { lat: 38.8463, lng: -77.3065 },
    '4400 University Dr, Fairfax, VA 22030': { lat: 38.8315, lng: -77.3061 },
    '7315 Ox Rd, Fairfax Station, VA 22039': { lat: 38.7997, lng: -77.2917 },
};

const libraries: ('places'|'drawing'|'geometry'|'localContext'|'visualization')[] = ['places'];

export default function LiveMapPage() {
    const { toast } = useToast();
    const auth = getAuth(app);
    const { events } = useEvents();
    const [user, setUser] = useState<User | null>(null);
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries
    });


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, [auth]);
    
    const eventLocations = useMemo<EventLocation[]>(() => {
        return events
            .map(event => {
                let location = eventCoordinates[event.address];
                if (!location) {
                    // Add a mock location for new events if address isn't in our list
                    const newLocation = { lat: 38.8315 + (Math.random() - 0.5) * 0.05, lng: -77.3061 + (Math.random() - 0.5) * 0.05 };
                    eventCoordinates[event.address] = newLocation;
                    location = newLocation;
                }
                return { ...location, id: event.id };
            })
            .filter((l): l is EventLocation => l !== null);
    }, [events]);


    const handleLocationSharing = (checked: boolean) => {
        setIsSharingLocation(checked);
        if (checked) {
            setIsGettingLocation(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setIsGettingLocation(false);
                    toast({
                        title: 'Location Sharing Enabled',
                        description: 'Your location is now visible on the map.',
                    });
                },
                (error) => {
                    console.error('Geolocation Error:', error);
                    toast({
                        title: 'Geolocation Error',
                        description: 'Could not get your location. Please ensure you have granted permission and have a stable connection.',
                        variant: "destructive",
                    });
                    setIsSharingLocation(false);
                    setIsGettingLocation(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            setIsGettingLocation(false);
        }
    };
    

  return (
    <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold">Live Mission Map</h1>
          <p className="text-muted-foreground">View active missions and user locations in real-time.</p>
        </div>
        <Card className="flex-grow">
          <CardContent className="h-full p-2">
            <div className="relative h-full w-full rounded-lg overflow-hidden border bg-muted">
              <InteractiveMap
                isLoaded={isLoaded}
                loadError={loadError}
                eventLocations={eventLocations}
              />
              <div className="absolute top-4 right-4 z-10">
                  <Card className="max-w-xs">
                      <CardHeader>
                          <CardTitle>Real-Time Controls</CardTitle>
                          <CardDescription>Manage your live presence.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="geo-sharing" className="flex items-center gap-2">
                                  {isGettingLocation ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : isSharingLocation ? (
                                      <LocateFixed className="h-4 w-4 text-primary" />
                                  ) : (
                                      <RadioTower className="h-4 w-4" />
                                  )}
                                  <span>Share My Location</span>
                              </Label>
                              <Switch
                                id="geo-sharing"
                                checked={isSharingLocation}
                                onCheckedChange={handleLocationSharing}
                                disabled={isGettingLocation}
                              />
                          </div>
                           <Button variant="outline" className="w-full"><ListFilter className="mr-2 h-4 w-4" /> Filter Missions</Button>
                           <Link href="/events" passHref className='w-full'>
                            <Button className="w-full">
                               <PlusCircle className="mr-2 h-4 w-4" />
                               Create Event
                             </Button>
                           </Link>
                      </CardContent>
                  </Card>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
