
'use client';

import { useState, useEffect } from 'react';
import { getAuth, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { InteractiveMap } from '@/components/interactive-map';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ListFilter, RadioTower, LocateFixed, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

interface Location {
  lat: number;
  lng: number;
}

export default function LiveMapPage() {
    const { toast } = useToast();
    const auth = getAuth(app);
    const [user, setUser] = useState<User | null>(null);
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, [auth]);

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
                    setCurrentLocation(newLocation);
                    setIsGettingLocation(false);
                    toast({
                        title: "Location Sharing Enabled",
                        description: "Your location is now visible on the map.",
                    });
                },
                (error) => {
                    console.error('Geolocation Error:', error);
                    toast({
                        title: "Geolocation Error",
                        description: "Could not get your location. Please ensure you have granted permission and have a stable connection.",
                        variant: "destructive",
                    });
                    setIsSharingLocation(false);
                    setIsGettingLocation(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            setCurrentLocation(null);
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
                userLocation={currentLocation}
                userAvatar={user?.photoURL || undefined}
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
                      </CardContent>
                  </Card>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
