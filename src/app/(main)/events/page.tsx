
'use client'

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle, Clock, MapPin, Trash2, Loader2 } from 'lucide-react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEvents } from '@/app/(main)/layout';


const eventTypes = ['Outreach', 'Worship', 'Training', 'Community'] as const;

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  date: z.date({ required_error: 'A date is required.' }),
  time: z.string().nonempty('A time is required.'),
  address: z.string().min(5, 'An address is required.'),
  type: z.enum(eventTypes),
});

type EventFormValues = z.infer<typeof eventSchema>;
const libraries: ('places'|'drawing'|'geometry'|'localContext'|'visualization')[] = ['places'];


export default function EventsPage() {
  const { toast } = useToast();
  const { events, addEvent, deleteEvent } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);


  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      libraries: libraries
  });

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

  async function onSubmit(data: EventFormValues) {
    setIsCreatingEvent(true);
    try {
      const res = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: data.address }),
      });
      if (!res.ok) throw new Error("Failed to geocode");
      const coords = await res.json();

      addEvent({ ...data, id: Date.now().toString(), ...coords });
      toast({
        title: "Event Created!",
        description: `The "${data.title}" event has been successfully added.`,
      });
      form.reset();
      setIsFormOpen(false);
    } catch (error) {
       console.error('Error creating event:', error);
       toast({
        title: "Error",
        description: "Could not create event. Failed to get coordinates for the address.",
        variant: "destructive"
      });
    } finally {
        setIsCreatingEvent(false);
    }
  }

  function handleCancelEvent(eventId: string, eventTitle: string) {
    deleteEvent(eventId);
    toast({
      title: "Event Cancelled",
      description: `The "${eventTitle}" event has been cancelled.`,
      variant: "destructive"
    });
  }
  
  const handlePlaceChanged = () => {
      if (autocompleteRef.current) {
          const place = autocompleteRef.current.getPlace();
          if (place && place.formatted_address) {
              form.setValue('address', place.formatted_address);
          }
      }
  };

  const handleInteractOutside = (e: Event) => {
    // This is to prevent the dialog from closing when clicking on the autocomplete suggestions
    if ((e.target as HTMLElement).closest('.pac-container')) {
      e.preventDefault();
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Community Events</h1>
            <p className="text-muted-foreground">Find and join upcoming ministry events.</p>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-0">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md"
                />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-4">
            <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Create New Event</CardTitle>
                    <CardDescription>Fill in the details below to add a new event.</CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {isFormOpen ? 'Close' : 'Create Event'}
                    </Button>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
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
                             {!isLoaded ? (
                                <div className="space-y-2">
                                    <Label>Address / Location</Label>
                                    <Skeleton className="h-10 w-full" />
                                </div>
                              ) : (
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Address / Location</FormLabel>
                                        <FormControl>
                                           <Autocomplete
                                              onLoad={(ref) => autocompleteRef.current = ref}
                                              onPlaceChanged={handlePlaceChanged}
                                              options={{
                                                types: ["geocode"],
                                                componentRestrictions: { country: "us" },
                                              }}
                                          >
                                              <Input placeholder="e.g., 123 Main St, Anytown" {...field} />
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
                                  <FormLabel>Event Type</FormLabel>
                                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select an event type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {eventTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </CardContent>
                        <CardFooter>
                          <Button type="submit" disabled={isCreatingEvent}>
                            {isCreatingEvent && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Event
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <h2 className="font-headline text-2xl font-semibold pt-4">Upcoming Events</h2>
            {events.length > 0 ? (
                events.map((event, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{event.title}</CardTitle>
                                    <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                                      <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" /> {event.date.toLocaleDateString()}</span>
                                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {event.time}</span>
                                    </div>
                                </div>
                                <Badge variant={event.type === 'Outreach' ? 'default' : 'secondary'}>{event.type}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{event.description}</p>
                            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5"><MapPin className="h-4 w-4"/>{event.address}</p>
                        </CardContent>
                        <CardFooter className="justify-between">
                            <Button>View Details</Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Cancel Event
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently cancel the event
                                    and remove its data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Go Back</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleCancelEvent(event.id, event.title)}>
                                    Yes, Cancel Event
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <Card className="flex flex-col items-center justify-center p-8 border-dashed">
                    <CardTitle>No Upcoming Events</CardTitle>
                    <CardDescription className="mt-2">Check back later or create a new event.</CardDescription>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
