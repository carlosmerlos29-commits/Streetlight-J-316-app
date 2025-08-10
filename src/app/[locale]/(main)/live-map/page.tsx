
'use client';

import { useState, useEffect, useMemo } from 'react';
import { getAuth, User } from 'firebase/auth';
import { useJsApiLoader } from '@react-google-maps/api';

import { app } from '@/lib/firebase';
import { InteractiveMap, EventLocation } from '@/components/interactive-map';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ListFilter, RadioTower, LocateFixed, Loader2, PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useEvents } from '@/app/[locale]/(main)/layout';
import Link from 'next/link';

interface Location { lat: number; lng: number; }
const libraries: ('places'|'drawing'|'geometry'|'localContext'|'visualization')[] = ['places'];

export default function LiveMapPage() {
    const { toast } = useToast();
    const auth = getAuth(app);
    const { events } = useEvents();
    const [user, setUser] = useState<User | null>(null);
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [userLocation, setUserLocation] = useState<Location | null>(null);
    
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
                if (event.lat && event.lng) {
                    return { lat: event.lat, lng: event.lng, id: event.id };
                }
                return null;
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
                    setUserLocation(newLocation);
                    setIsGettingLocation(false);
                    toast({
                        title: 'Ubicación Compartida Activada',
                        description: 'Tu ubicación ahora es visible en el mapa.',
                    });
                },
                (error) => {
                    console.error('Error de geolocalización:', error);
                    toast({
                        title: 'Error de Geolocalización',
                        description: 'No se pudo obtener tu ubicación. Asegúrate de haber otorgado permiso y tener una conexión estable.',
                        variant: "destructive",
                    });
                    setIsSharingLocation(false);
                    setIsGettingLocation(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            setUserLocation(null);
            setIsGettingLocation(false);
        }
    };
    

  return (
    <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold">Mapa de Misiones en Vivo</h1>
          <p className="text-muted-foreground">Ve misiones activas y ubicaciones de usuarios en tiempo real.</p>
        </div>
        <Card className="flex-grow">
          <CardContent className="h-full p-2">
            <div className="relative h-full w-full rounded-lg overflow-hidden border bg-muted">
              <InteractiveMap
                isLoaded={isLoaded}
                loadError={loadError}
                eventLocations={eventLocations}
                userLocation={userLocation}
              />
              <div className="absolute top-4 right-4 z-10">
                  <Card className="max-w-xs">
                      <CardHeader>
                          <CardTitle>Controles en Tiempo Real</CardTitle>
                          <CardDescription>Gestiona tu presencia en vivo.</CardDescription>
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
                                  <span>Compartir Mi Ubicación</span>
                              </Label>
                              <Switch
                                id="geo-sharing"
                                checked={isSharingLocation}
                                onCheckedChange={handleLocationSharing}
                                disabled={isGettingLocation}
                              />
                          </div>
                           <Button variant="outline" className="w-full"><ListFilter className="mr-2 h-4 w-4" /> Filtrar Misiones</Button>
                           <Link href="/events" passHref className='w-full'>
                            <Button className="w-full">
                               <PlusCircle className="mr-2 h-4 w-4" />
                               Crear Evento
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

    
