

'use client';

import { useState, useEffect, useRef } from 'react';
import { getAuth, User } from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

import { app } from '@/lib/firebase';
import { InteractiveMap } from '@/components/interactive-map';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ListFilter, RadioTower, LocateFixed, Loader2, PlusCircle, Calendar as CalendarIcon, Flame, CalendarDays, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useEvents } from '@/app/(main)/layout';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useTranslations } from 'next-intl';


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
    '4110 Chain Bridge Rd, Fairfax, VA 22030': { lat: 38.8463, lng: -77.3065 },
    '4400 University Dr, Fairfax, VA 22030': { lat: 38.8315, lng: -77.3061 },
    '7315 Ox Rd, Fairfax Station, VA 22039': { lat: 38.7997, lng: -77.2917 },
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
const libraries: ('places'|'drawing'|'geometry'|'localContext'|'visualization')[] = ['places'];

export default function LiveMapPage() {
    const t = useTranslations('LiveMap');
    const t_general = useTranslations('General');
    const { toast } = useToast();
    const auth = getAuth(app);
    const { events, addEvent } = useEvents();
    const [user, setUser] = useState<User | null>(null);
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [eventLocations, setEventLocations] = useState<EventLocation[]>([]);
    
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries
    });


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
                
                if (!eventCoordinates[event.address]) {
                    eventCoordinates[event.address] = { lat: 38.8315 + (Math.random() - 0.5) * 0.05, lng: -77.3061 + (Math.random() - 0.5) * 0.05 };
                }

                const coords = eventCoordinates[event.address];

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
            date: undefined,
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
          title: t('toast.eventCreatedTitle'),
          description: t('toast.eventCreatedDescription', { title: data.title }),
        });
        form.reset({
            title: '',
            description: '',
            date: undefined,
            time: '',
            address: '',
        });
        setIsFormOpen(false);
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
                        title: t('toast.locationSharingTitle'),
                        description: t('toast.locationSharingDescription'),
                    });
                },
                (error) => {
                    console.error('Geolocation Error:', error);
                    toast({
                        title: t('toast.geolocationErrorTitle'),
                        description: t('toast.geolocationErrorDescription'),
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
    
    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.formatted_address) {
                form.setValue('address', place.formatted_address);
            }
        }
    };

    const handleInteractOutside = (e: Event) => {
        if ((e.target as HTMLElement).closest('.pac-container')) {
            e.preventDefault();
        }
    };

  return (
    <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <Card className="flex-grow">
          <CardContent className="h-full p-2">
            <div className="relative h-full w-full rounded-lg overflow-hidden border bg-muted">
              <InteractiveMap
                isLoaded={isLoaded}
                loadError={loadError}
              />
              <div className="absolute top-4 right-4 z-10">
                  <Card className="max-w-xs">
                    <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
                      <CardHeader>
                          <CardTitle>{t('controls.title')}</CardTitle>
                          <CardDescription>{t('controls.description')}</CardDescription>
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
                                  <span>{t('controls.shareLocation')}</span>
                              </Label>
                              <Switch
                                id="geo-sharing"
                                checked={isSharingLocation}
                                onCheckedChange={handleLocationSharing}
                                disabled={isGettingLocation}
                              />
                          </div>
                           <Button variant="outline" className="w-full"><ListFilter className="mr-2 h-4 w-4" /> {t('controls.filterMissions')}</Button>
                           <CollapsibleTrigger asChild>
                             <Button className="w-full">
                               <PlusCircle className="mr-2 h-4 w-4" />
                               {isFormOpen ? t_general('close') : t('controls.createEvent')}
                             </Button>
                           </CollapsibleTrigger>
                      </CardContent>
                      <CollapsibleContent>
                            <Form {...form}>
                              <form onSubmit={form.handleSubmit(onEventSubmit)}>
                               <CardContent className="space-y-4 pt-4">
                                <FormField
                                  control={form.control}
                                  name="title"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t('form.eventTitleLabel')}</FormLabel>
                                      <FormControl>
                                        <Input placeholder={t('form.eventTitlePlaceholder')} {...field} />
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
                                      <FormLabel>{t('form.descriptionLabel')}</FormLabel>
                                      <FormControl>
                                        <Textarea placeholder={t('form.descriptionPlaceholder')} {...field} />
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
                                          <FormLabel>{t('form.dateLabel')}</FormLabel>
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
                                                    <span>{t('form.datePlaceholder')}</span>
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
                                          <FormLabel>{t('form.timeLabel')}</FormLabel>
                                          <FormControl>
                                            <Input type="time" placeholder={t('form.timePlaceholder')} {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                </div>
                                {!isLoaded ? (
                                    <div className="space-y-2">
                                        <Label>{t('form.addressLabel')}</Label>
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ) : (
                                <FormField
                                  control={form.control}
                                  name="address"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t('form.addressLabel')}</FormLabel>
                                      <FormControl>
                                        <Autocomplete
                                            onLoad={(ref) => autocompleteRef.current = ref}
                                            onPlaceChanged={handlePlaceChanged}
                                            options={{
                                              types: ["geocode"],
                                              componentRestrictions: { country: "us" },
                                            }}
                                        >
                                            <Input placeholder={t('form.addressPlaceholder')} {...field} />
                                        </Autocomplete>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                )}
                                <FormField
                                  control={form.control}
                                  name="type"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>{t('form.typeLabel')}</FormLabel>
                                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                          <SelectTrigger>
                                            <SelectValue placeholder={t('form.typePlaceholder')} />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="Outreach">{t_general('eventType.Outreach')}</SelectItem>
                                          <SelectItem value="Worship">{t_general('eventType.Worship')}</SelectItem>
                                          <SelectItem value="Training">{t_general('eventType.Training')}</SelectItem>
                                          <SelectItem value="Community">{t_general('eventType.Community')}</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                               </CardContent>
                                <CardFooter>
                                  <Button type="submit" className="w-full">{t('controls.createEvent')}</Button>
                                </CardFooter>
                              </form>
                            </Form>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
