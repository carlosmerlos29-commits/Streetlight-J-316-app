
'use client';

import { useState, useEffect } from 'react';
import { getAuth, User } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { app } from '@/lib/firebase';
import { InteractiveMap } from '@/components/interactive-map';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ListFilter, RadioTower, LocateFixed, Loader2, PlusCircle, Calendar as CalendarIcon, Flame, CalendarDays, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useEvents } from '@/app/(main)/layout';

interface Location {
  lat: number;
  lng: number;
}

export interface EventLocation extends Location {
    id: string;
    title: string;
    isLive: boolean;
}

// Mock geocoded locations for demo purposes
const eventCoordinates: { [key: string]: Location } = {
    'City Center Plaza': { lat: 38.8305, lng: -77.3060 },
    '123 Main St, Community Church': { lat: 38.8330, lng: -77.3090 },
    'Online via Zoom': { lat: 38.829, lng: -77.304 },
};

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  date: z.date({ required_error: 'A date is required.' }),
  time: z.string().nonempty('A time is required.'),
  address: z.string().min(5, 'An address is required.'),
  type: z.enum(['Outreach', 'Worship', 'Training', 'Community']),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function LiveMapPage() {
    const { toast } = useToast();
    const auth = getAuth(app);
    const { events, addEvent } = useEvents();
    const [user, setUser] = useState<User | null>(null);
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [eventLocations, setEventLocations] = useState<EventLocation[]>([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        const updateLocations = () => {
            const now = new Date();
            const locations = events.map(event => {
                const eventDateTime = new Date(event.date);
                const [hours, minutes] = event.time.split(':').map(Number);
                eventDateTime.setHours(hours);
                eventDateTime.setMinutes(minutes);
                eventDateTime.setSeconds(0);

                const isLive = now >= eventDateTime;

                const coords = eventCoordinates[event.address] || { lat: 38.8315 + (Math.random() - 0.5) * 0.05, lng: -77.3061 + (Math.random() - 0.5) * 0.05 }; // Fallback with random jitter

                if (coords) {
                    return {
                        id: event.id,
                        title: event.title,
                        isLive: isLive,
                        ...coords
                    };
                }
                return null;
            }).filter((l): l is EventLocation => l !== null);
            setEventLocations(locations);
        };
        
        updateLocations();
        
        const interval = setInterval(() => {
             updateLocations();
        }, 60000);

        return () => clearInterval(interval);

    }, [events]);


    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            title: '',
            description: '',
            time: '',
            address: '',
        }
    });

    function onEventSubmit(data: EventFormValues) {
        const newEventId = (events.length + 1).toString();
        // Add a mock location for the new event if its address isn't in our list
        if (!eventCoordinates[data.address]) {
            eventCoordinates[data.address] = { lat: 38.8315 + (Math.random() - 0.5) * 0.05, lng: -77.3061 + (Math.random() - 0.5) * 0.05 };
        }
        addEvent({ ...data, id: newEventId });
        toast({
          title: 'Event Created!',
          description: `The event "${data.title}" has been successfully added.`,
        });
        form.reset();
        setIsDialogOpen(false);
    }

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
                userLocation={currentLocation}
                userAvatar={user?.photoURL || undefined}
                userName={user?.displayName || "You"}
                events={eventLocations}
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
                           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                              <DialogTrigger asChild>
                                <Button className="w-full">
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Create Event
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Create New Event</DialogTitle>
                                  <DialogDescription>
                                    Fill in the details below to add a new event.
                                  </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                  <form onSubmit={form.handleSubmit(onEventSubmit)} className="space-y-4">
                                    <FormField
                                      control={form.control}
                                      name="title"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Event Title</FormLabel>
                                          <FormControl>
                                            <Input placeholder="e.g., Summer Outreach" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="description"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Description</FormLabel>
                                          <FormControl>
                                            <Textarea placeholder="Tell us about the event..." {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                          control={form.control}
                                          name="date"
                                          render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                              <FormLabel>Event Date</FormLabel>
                                              <Popover>
                                                <PopoverTrigger asChild>
                                                  <FormControl>
                                                    <Button
                                                      variant={"outline"}
                                                      className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                      )}
                                                    >
                                                      {field.value ? (
                                                        format(field.value, "PPP")
                                                      ) : (
                                                        <span>Pick a date</span>
                                                      )}
                                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                  </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                  <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                      date < new Date(new Date().setHours(0,0,0,0))
                                                    }
                                                    initialFocus
                                                  />
                                                </PopoverContent>
                                              </Popover>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                        <FormField
                                          control={form.control}
                                          name="time"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Event Time</FormLabel>
                                              <FormControl>
                                                <Input type="time" placeholder="e.g., 6:00 PM" {...field} />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />
                                    </div>
                                    <FormField
                                      control={form.control}
                                      name="address"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Address / Location</FormLabel>
                                          <FormControl>
                                            <Input placeholder="e.g., 123 Main St, Anytown" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={form.control}
                                      name="type"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Event Type</FormLabel>
                                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Select an event type" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value="Outreach">Outreach</SelectItem>
                                              <SelectItem value="Worship">Worship</SelectItem>
                                              <SelectItem value="Training">Training</SelectItem>
                                              <SelectItem value="Community">Community</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <DialogFooter>
                                      <Button type="submit">Create Event</Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                      </CardContent>
                  </Card>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
