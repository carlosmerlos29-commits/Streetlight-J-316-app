

'use client'

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle, Clock, MapPin } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useEvents } from '@/app/(main)/layout';
import { useTranslations } from 'next-intl';


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


export default function EventsPage() {
  const t = useTranslations('Events');
  const t_general = useTranslations('General');
  const { toast } = useToast();
  const { events, addEvent } = useEvents();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  function onSubmit(data: EventFormValues) {
    addEvent({ ...data, id: (events.length + 1).toString() });
    toast({
      title: t('toast.successTitle'),
      description: t('toast.successDescription', { title: data.title }),
    });
    form.reset();
    setIsFormOpen(false);
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
            <h1 className="font-headline text-3xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground">{t('description')}</p>
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
                    <CardTitle>{t('form.title')}</CardTitle>
                    <CardDescription>{t('form.description')}</CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {isFormOpen ? t_general('close') : t('form.createEventButton')}
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
                          <Button type="submit">{t('form.createEventButton')}</Button>
                        </CardFooter>
                      </form>
                    </Form>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <h2 className="font-headline text-2xl font-semibold pt-4">{t('upcomingEvents')}</h2>
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
                                <Badge variant={event.type === 'Outreach' ? 'default' : 'secondary'}>{t_general(`eventType.${event.type}`)}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{event.description}</p>
                            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5"><MapPin className="h-4 w-4"/>{event.address}</p>
                            <Button className="mt-4">{t('viewDetailsButton')}</Button>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <Card className="flex flex-col items-center justify-center p-8 border-dashed">
                    <CardTitle>{t('noEvents.title')}</CardTitle>
                    <CardDescription className="mt-2">{t('noEvents.description')}</CardDescription>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
