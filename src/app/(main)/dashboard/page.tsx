
'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { aiMissionPlanning } from '@/ai/flows/ai-mission-planning';
import { getEvangelismCoaching } from '@/ai/flows/ai-evangelism-coaching';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Lightbulb, MapPin, Clock } from 'lucide-react';
import type { AiMissionPlanningOutput } from '@/ai/flows/ai-mission-planning';
import type { GetEvangelismCoachingOutput } from '@/ai/flows/ai-evangelism-coaching';
import { useToast } from "@/hooks/use-toast"
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { Skeleton } from '@/components/ui/skeleton';


const missionPlannerSchema = z.object({
  location: z.string().min(3, 'La ubicación debe tener al menos 3 caracteres.'),
  topic: z.string().min(5, 'El tema debe tener al menos 5 caracteres.'),
  preferences: z.string().optional(),
});

const coachingSchema = z.object({
    missionDescription: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
    userExperience: z.string().min(3, 'El nivel de experiencia es requerido.'),
    targetAudience: z.string().min(5, 'El público objetivo debe tener al menos 5 caracteres.'),
});

type MissionPlan = AiMissionPlanningOutput;
type CoachingTips = GetEvangelismCoachingOutput;

const libraries: ('places'|'drawing'|'geometry'|'localContext'|'visualization')[] = ['places'];


export default function MissionPlannerPage() {
    const { toast } = useToast();
    const [isPlanning, setIsPlanning] = useState(false);
    const [isCoaching, setIsCoaching] = useState(false);
    const [missionPlan, setMissionPlan] = useState<MissionPlan | null>(null);
    const [coachingTips, setCoachingTips] = useState<CoachingTips | null>(null);

    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
        libraries: libraries
    });

    const plannerForm = useForm<z.infer<typeof missionPlannerSchema>>({
        resolver: zodResolver(missionPlannerSchema),
        defaultValues: { location: '', topic: '', preferences: '' },
    });

    const coachingForm = useForm<z.infer<typeof coachingSchema>>({
        resolver: zodResolver(coachingSchema),
        defaultValues: { missionDescription: '', userExperience: '', targetAudience: '' },
    });

    async function onPlannerSubmit(values: z.infer<typeof missionPlannerSchema>) {
        setIsPlanning(true);
        setMissionPlan(null);
        try {
            const result = await aiMissionPlanning(values);
            setMissionPlan(result);
        } catch (error) {
            console.error('Error al planificar la misión:', error);
            toast({
                title: 'Error',
                description: 'No se pudo generar el plan de misión. Por favor, intenta de nuevo.',
                variant: "destructive",
            });
        } finally {
            setIsPlanning(false);
        }
    }
    
    async function onCoachingSubmit(values: z.infer<typeof coachingSchema>) {
        setIsCoaching(true);
        setCoachingTips(null);
        try {
            const result = await getEvangelismCoaching(values);
            setCoachingTips(result);
        } catch (error) {
            console.error('Error al obtener coaching:', error);
            toast({
                title: 'Error',
                description: 'No se pudieron generar los consejos de coaching. Por favor, intenta de nuevo.',
                variant: "destructive",
            });
        } finally {
            setIsCoaching(false);
        }
    }

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place && place.formatted_address) {
                plannerForm.setValue('location', place.formatted_address);
            }
        }
    };
  
    if (loadError) {
        return <div>Error al cargar los mapas. Por favor, asegúrate de que tu clave de API sea correcta.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-3xl font-bold">Asistente de IA</h1>
                    <p className="text-muted-foreground">Planifica tus misiones y obtén consejos de coaching.</p>
                </div>
            </div>

            <Tabs defaultValue="planner">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="planner">Planificador de Misiones</TabsTrigger>
                    <TabsTrigger value="coaching">Coaching de Evangelismo</TabsTrigger>
                </TabsList>
                <TabsContent value="planner">
                    <Card>
                        <CardHeader>
                            <CardTitle>Planificador de Misiones con IA</CardTitle>
                            <CardDescription>Obtén sugerencias de la IA para ubicaciones y horarios óptimos de misiones.</CardDescription>
                        </CardHeader>
                        <Form {...plannerForm}>
                            <form onSubmit={plannerForm.handleSubmit(onPlannerSubmit)}>
                                <CardContent className="space-y-4">
                                    {!isLoaded ? (
                                        <div className="space-y-2">
                                            <Label>Ubicación General</Label>
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    ) : (
                                        <FormField control={plannerForm.control} name="location" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ubicación General</FormLabel>
                                                <FormControl>
                                                    <Autocomplete
                                                        onLoad={(ref) => autocompleteRef.current = ref}
                                                        onPlaceChanged={handlePlaceChanged}
                                                        options={{
                                                          types: ["geocode"],
                                                          componentRestrictions: { country: "us" },
                                                        }}
                                                    >
                                                        <Input placeholder="ej., Centro, San Francisco" {...field} />
                                                    </Autocomplete>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    )}
                                    <FormField control={plannerForm.control} name="topic" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tema/Asunto de la Misión</FormLabel>
                                            <FormControl><Input placeholder="ej., Repartir folletos, Predicación callejera" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={plannerForm.control} name="preferences" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preferencias (Opcional)</FormLabel>
                                            <FormControl><Textarea placeholder="ej., Tardes entre semana, cerca de un parque" {...field} /></FormControl>
                                            <FormDescription>Cualquier preferencia específica de horario, lugar, etc.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={isPlanning}>
                                        {isPlanning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Generar Plan
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>
                <TabsContent value="coaching">
                    <Card>
                        <CardHeader>
                            <CardTitle>Coaching de Evangelismo con IA</CardTitle>
                            <CardDescription>Recibe consejos de coaching personalizados para mejorar tu enfoque.</CardDescription>
                        </CardHeader>
                        <Form {...coachingForm}>
                            <form onSubmit={coachingForm.handleSubmit(onCoachingSubmit)}>
                                <CardContent className="space-y-4">
                                    <FormField control={coachingForm.control} name="missionDescription" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Descripción de la Misión</FormLabel>
                                            <FormControl><Textarea placeholder="Describe la misión de evangelismo que has planeado." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={coachingForm.control} name="userExperience" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tu Nivel de Experiencia</FormLabel>
                                            <FormControl><Input placeholder="ej., Principiante, Intermedio, Experimentado" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={coachingForm.control} name="targetAudience" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Público Objetivo</FormLabel>
                                            <FormControl><Input placeholder="ej., Estudiantes universitarios, Viajeros, Familias" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={isCoaching}>
                                        {isCoaching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Obtener Consejos
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>
            </Tabs>
            
            {isPlanning && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {missionPlan && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Tu Plan de Misión</CardTitle>
                        <CardDescription>Aquí están las sugerencias generadas por la IA para tu misión.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold flex items-center mb-2"><MapPin className="mr-2 h-5 w-5 text-primary" />Ubicaciones Sugeridas</h3>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                {missionPlan.suggestedLocations.map((loc, i) => <li key={i}>{loc}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold flex items-center mb-2"><Clock className="mr-2 h-5 w-5 text-primary" />Horarios Sugeridos</h3>
                             <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                {missionPlan.suggestedTimes.map((time, i) => <li key={i}>{time}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold flex items-center mb-2"><Lightbulb className="mr-2 h-5 w-5 text-primary" />Razonamiento</h3>
                            <p className="text-muted-foreground">{missionPlan.reasoning}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isCoaching && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {coachingTips && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Tus Consejos de Coaching</CardTitle>
                        <CardDescription>Aquí tienes algunos consejos para mejorar tu evangelismo.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ul className="space-y-4">
                            {coachingTips.coachingTips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <div className="p-1.5 bg-accent/20 rounded-full mt-1">
                                      <Lightbulb className="h-4 w-4 text-accent-foreground" />
                                    </div>
                                    <span className="flex-1 text-muted-foreground">{tip}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
