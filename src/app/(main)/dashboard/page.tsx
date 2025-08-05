

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
  location: z.string().min(3, 'Location must be at least 3 characters.'),
  topic: z.string().min(5, 'Topic must be at least 5 characters.'),
  preferences: z.string().optional(),
});

const coachingSchema = z.object({
    missionDescription: z.string().min(10, 'Description must be at least 10 characters.'),
    userExperience: z.string().min(3, 'Experience level is required.'),
    targetAudience: z.string().min(5, 'Target audience must be at least 5 characters.'),
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
            console.error('Error planning mission:', error);
            toast({
                title: "Error",
                description: "Failed to generate mission plan. Please try again.",
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
            console.error('Error getting coaching:', error);
            toast({
                title: "Error",
                description: "Failed to generate coaching tips. Please try again.",
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
        return <div>Error loading maps. Please ensure your API key is correct.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-headline text-3xl font-bold">AI Assistant</h1>
                    <p className="text-muted-foreground">Plan your missions and get coaching tips.</p>
                </div>
            </div>

            <Tabs defaultValue="planner">
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="planner">Mission Planner</TabsTrigger>
                    <TabsTrigger value="coaching">Evangelism Coaching</TabsTrigger>
                </TabsList>
                <TabsContent value="planner">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Mission Planner</CardTitle>
                            <CardDescription>Get AI-powered suggestions for optimal mission locations and times.</CardDescription>
                        </CardHeader>
                        <Form {...plannerForm}>
                            <form onSubmit={plannerForm.handleSubmit(onPlannerSubmit)}>
                                <CardContent className="space-y-4">
                                    {!isLoaded ? (
                                        <div className="space-y-2">
                                            <Label>General Location</Label>
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    ) : (
                                        <FormField control={plannerForm.control} name="location" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>General Location</FormLabel>
                                                <FormControl>
                                                    <Autocomplete
                                                        onLoad={(ref) => autocompleteRef.current = ref}
                                                        onPlaceChanged={handlePlaceChanged}
                                                        options={{
                                                          types: ["geocode"],
                                                          componentRestrictions: { country: "us" },
                                                        }}
                                                    >
                                                        <Input placeholder="e.g., Downtown, San Francisco" {...field} />
                                                    </Autocomplete>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    )}
                                    <FormField control={plannerForm.control} name="topic" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mission Topic/Theme</FormLabel>
                                            <FormControl><Input placeholder="e.g., Handing out tracts, Street preaching" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={plannerForm.control} name="preferences" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Preferences (Optional)</FormLabel>
                                            <FormControl><Textarea placeholder="e.g., Weekday afternoons, near a park" {...field} /></FormControl>
                                            <FormDescription>Any specific preferences for time, venue, etc.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={isPlanning}>
                                        {isPlanning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Generate Plan
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </TabsContent>
                <TabsContent value="coaching">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Evangelism Coaching</CardTitle>
                            <CardDescription>Receive personalized coaching tips to improve your approach.</CardDescription>
                        </CardHeader>
                        <Form {...coachingForm}>
                            <form onSubmit={coachingForm.handleSubmit(onCoachingSubmit)}>
                                <CardContent className="space-y-4">
                                    <FormField control={coachingForm.control} name="missionDescription" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mission Description</FormLabel>
                                            <FormControl><Textarea placeholder="Describe the evangelism mission you have planned." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={coachingForm.control} name="userExperience" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Experience Level</FormLabel>
                                            <FormControl><Input placeholder="e.g., Beginner, Intermediate, Experienced" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={coachingForm.control} name="targetAudience" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target Audience</FormLabel>
                                            <FormControl><Input placeholder="e.g., College students, Commuters, Families" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" disabled={isCoaching}>
                                        {isCoaching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Get Coaching
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
                        <CardTitle>Your Mission Plan</CardTitle>
                        <CardDescription>Here are the AI-generated suggestions for your mission.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold flex items-center mb-2"><MapPin className="mr-2 h-5 w-5 text-primary" />Suggested Locations</h3>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                {missionPlan.suggestedLocations.map((loc, i) => <li key={i}>{loc}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold flex items-center mb-2"><Clock className="mr-2 h-5 w-5 text-primary" />Suggested Times</h3>
                             <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                {missionPlan.suggestedTimes.map((time, i) => <li key={i}>{time}</li>)}
                            </ul>
                        </div>
<div>
                            <h3 className="font-semibold flex items-center mb-2"><Lightbulb className="mr-2 h-5 w-5 text-primary" />Reasoning</h3>
                            <p className="text-muted-foreground">{missionPlan.reasoning}</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {isCoaching && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {coachingTips && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Your Coaching Tips</CardTitle>
                        <CardDescription>Here are some tips to enhance your evangelism.</CardDescription>
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
