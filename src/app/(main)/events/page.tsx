
'use client'

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const initialEvents = [
    { date: new Date(2024, 6, 20), title: 'City-Wide Outreach', description: 'Join us for a large-scale evangelism event at the city center.', type: 'Outreach' },
    { date: new Date(2024, 6, 25), title: 'Prayer & Worship Night', description: 'A night dedicated to prayer for our city and worship.', type: 'Worship' },
    { date: new Date(2024, 7, 5), title: 'Evangelism Training Workshop', description: 'Learn practical skills for sharing your faith.', type: 'Training' },
];

const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  date: z.date({ required_error: 'A date is required.' }),
  type: z.enum(['Outreach', 'Worship', 'Training', 'Community']),
});

type EventFormValues = z.infer<typeof eventSchema>;

export default function EventsPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
  });

  function onSubmit(data: EventFormValues) {
    setEvents(prevEvents => [...prevEvents, data].sort((a, b) => a.date.getTime() - b.date.getTime()));
    toast({
      title: 'Event Created!',
      description: `The event "${data.title}" has been successfully added.`,
    });
    form.reset();
    setIsDialogOpen(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="font-headline text-3xl font-bold">Community Events</h1>
            <p className="text-muted-foreground">Find and join upcoming ministry events.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new event to the calendar.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <h2 className="font-headline text-2xl font-semibold">Upcoming Events</h2>
            {events.length > 0 ? (
                events.map((event, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{event.title}</CardTitle>
                                    <CardDescription>{event.date.toLocaleDateString()}</CardDescription>
                                </div>
                                <Badge variant={event.type === 'Outreach' ? 'default' : 'secondary'}>{event.type}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{event.description}</p>
                            <Button className="mt-4">View Details</Button>
                        </CardContent>
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
