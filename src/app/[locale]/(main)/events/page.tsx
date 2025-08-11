
'use client'

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
import { useEvents } from '@/app/[locale]/(main)/layout';


const eventTypes = ['Outreach', 'Worship', 'Training', 'Community'] as const;
const translatedEventTypes = {
  'Outreach': 'Alcance',
  'Worship': 'Adoración',
  'Training': 'Capacitación',
  'Community': 'Comunitario',
};

const eventSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  date: z.date({ required_error: 'Se requiere una fecha.' }),
  time: z.string().nonempty('Se requiere una hora.'),
  address: z.string().min(5, 'Se requiere una dirección.'),
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
        title: "¡Evento Creado!",
        description: `El evento "${data.title}" ha sido añadido exitosamente.`,
      });
      form.reset();
      setIsFormOpen(false);
    } catch (error) {
       console.error('Error creando evento:', error);
       toast({
        title: "Error",
        description: "No se pudo crear el evento. No se pudieron obtener las coordenadas para la dirección.",
        variant: "destructive"
      });
    } finally {
        setIsCreatingEvent(false);
    }
  }

  function handleCancelEvent(eventId: string, eventTitle: string) {
    deleteEvent(eventId);
    toast({
      title: "Evento Cancelado",
      description: `El evento "${eventTitle}" ha sido cancelado.`,
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
            <h1 className="font-headline text-3xl font-bold">Eventos Comunitarios</h1>
            <p className="text-muted-foreground">Encuentra y únete a los próximos eventos del ministerio.</p>
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
                    locale={es}
                />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-4">
            <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Crear Nuevo Evento</CardTitle>
                    <CardDescription>Completa los detalles a continuación para añadir un nuevo evento.</CardDescription>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {isFormOpen ? 'Cerrar' : 'Crear Evento'}
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
                                  <FormLabel>Título del Evento</FormLabel>
                                  <FormControl>
                                    <Input placeholder="ej., Alcance de Verano" {...field} />
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
                                  <FormLabel>Descripción</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="Cuéntanos sobre el evento..." {...field} />
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
                                      <FormLabel>Fecha del Evento</FormLabel>
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
                                                format(field.value, "PPP", { locale: es })
                                              ) : (
                                                <span>Elige una fecha</span>
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
                                            locale={es}
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
                                      <FormLabel>Hora del Evento</FormLabel>
                                      <FormControl>
                                        <Input type="time" placeholder="ej., 6:00 PM" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                            </div>
                             {!isLoaded ? (
                                <div className="space-y-2">
                                    <Label>Dirección / Ubicación</Label>
                                    <Skeleton className="h-10 w-full" />
                                </div>
                              ) : (
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Dirección / Ubicación</FormLabel>
                                        <FormControl>
                                           <Autocomplete
                                              onLoad={(ref) => autocompleteRef.current = ref}
                                              onPlaceChanged={handlePlaceChanged}
                                              options={{
                                                types: ["geocode"],
                                                componentRestrictions: { country: "us" },
                                              }}
                                          >
                                              <Input placeholder="ej., 123 Calle Principal, Anytown" {...field} />
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
                                  <FormLabel>Tipo de Evento</FormLabel>
                                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Selecciona un tipo de evento" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {eventTypes.map(type => (
                                        <SelectItem key={type} value={type}>{translatedEventTypes[type]}</SelectItem>
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
                            Crear Evento
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            <h2 className="font-headline text-2xl font-semibold pt-4">Próximos Eventos</h2>
            {events.length > 0 ? (
                events.map((event, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{event.title}</CardTitle>
                                    <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                                      <span className="flex items-center gap-1.5"><CalendarIcon className="h-4 w-4" /> {event.date.toLocaleDateString('es-ES')}</span>
                                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {event.time}</span>
                                    </div>
                                </div>
                                <Badge variant={event.type === 'Outreach' ? 'default' : 'secondary'}>{translatedEventTypes[event.type]}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{event.description}</p>
                            <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5"><MapPin className="h-4 w-4"/>{event.address}</p>
                        </CardContent>
                        <CardFooter className="justify-between">
                            <Button>Ver Detalles</Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Cancelar Evento
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Esto cancelará permanentemente el evento
                                    y eliminará sus datos de nuestros servidores.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Volver</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleCancelEvent(event.id, event.title)}>
                                    Sí, Cancelar Evento
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <Card className="flex flex-col items-center justify-center p-8 border-dashed">
                    <CardTitle>No Hay Próximos Eventos</CardTitle>
                    <CardDescription className="mt-2">Vuelve más tarde o crea un nuevo evento.</CardDescription>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
