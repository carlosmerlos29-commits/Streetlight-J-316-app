'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const events = [
    { date: new Date(2024, 6, 20), title: 'City-Wide Outreach', description: 'Join us for a large-scale evangelism event at the city center.', type: 'Outreach' },
    { date: new Date(2024, 6, 25), title: 'Prayer & Worship Night', description: 'A night dedicated to prayer for our city and worship.', type: 'Worship' },
    { date: new Date(2024, 7, 5), title: 'Evangelism Training Workshop', description: 'Learn practical skills for sharing your faith.', type: 'Training' },
];

export default function EventsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Community Events</h1>
        <p className="text-muted-foreground">Find and join upcoming ministry events.</p>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-4">
            <h2 className="font-headline text-2xl font-semibold">Upcoming Events</h2>
            {events.map((event, index) => (
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
            ))}
        </div>
      </div>
    </div>
  );
}
