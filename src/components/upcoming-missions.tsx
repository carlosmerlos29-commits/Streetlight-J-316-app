
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { useEvents, AppEvent } from '@/app/[locale]/(main)/layout';
import { useMemo } from 'react';

function getEventStatus(event: AppEvent) {
    const now = new Date();
    const eventDateOnly = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate());
    
    // Default to a time if not provided, for comparison logic.
    const eventDateTime = new Date(event.date);
    if (event.time) {
        const [hours, minutes] = event.time.split(':').map(Number);
        eventDateTime.setHours(hours, minutes, 0, 0);
    } else {
        // If no time, treat as all-day event
        if (eventDateOnly.getTime() === new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
             return 'active';
        }
        if (eventDateOnly < now) {
            return 'recent';
        }
        return 'upcoming';
    }

    if (now < eventDateTime) {
        return 'upcoming';
    }

    // Consider events within the last 2 hours as active
    const diffHours = (now.getTime() - eventDateTime.getTime()) / (1000 * 60 * 60);
    if (diffHours <= 2) {
        return 'active';
    }
    
    return 'recent';
}

function formatTime(event: AppEvent) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDate = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate());

    if (!event.time) return event.date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const [hours, minutes] = event.time.split(':').map(Number);
    const eventDateTime = new Date();
    eventDateTime.setHours(hours, minutes);
    const timeString = eventDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    if (eventDate.getTime() === today.getTime()) {
        return `Today at ${timeString}`;
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (eventDate.getTime() === tomorrow.getTime()) {
        return `Tomorrow at ${timeString}`;
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (eventDate.getTime() === yesterday.getTime()) {
        return `Yesterday at ${timeString}`;
    }
    
    return `${event.date.toLocaleDateString()} at ${timeString}`;
}

export function UpcomingMissions() {
  const { events } = useEvents();

  const missions = useMemo(() => {
    return events.map(event => ({
      ...event,
      status: getEventStatus(event),
      displayTime: formatTime(event),
    })).sort((a, b) => {
        const aDate = new Date(a.date);
        if (a.time) {
          const [aHours, aMinutes] = a.time.split(':').map(Number);
          aDate.setHours(aHours, aMinutes);
        }

        const bDate = new Date(b.date);
        if (b.time) {
          const [bHours, bMinutes] = b.time.split(':').map(Number);
          bDate.setHours(bHours, bMinutes);
        }
        
        const now = new Date().getTime();
        const aDiff = Math.abs(aDate.getTime() - now);
        const bDiff = Math.abs(bDate.getTime() - now);

        if (a.status === 'upcoming' && b.status === 'upcoming') {
            return aDate.getTime() - bDate.getTime(); // Sort upcoming events ascending
        }
        if (a.status !== 'upcoming' && b.status !== 'upcoming') {
            return bDate.getTime() - aDate.getTime(); // Sort active/recent events descending
        }
        if(a.status === 'upcoming') return -1; // Keep upcoming events at the top
        return 1;
    });
  }, [events]);

  const activeMissions = missions.filter(m => m.status === 'active');
  const upcomingMissions = missions.filter(m => m.status === 'upcoming');
  const recentMissions = missions.filter(m => m.status === 'recent');


  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h2 className="text-2xl font-bold font-headline">Missions</h2>
        <p className="text-sm text-muted-foreground">Active, upcoming, and recent.</p>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-2 px-2">Active</h3>
            {activeMissions.length > 0 ? activeMissions.map((mission, index) => (
              <Card key={index} className="mb-2">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">{mission.title}</CardTitle>
                      <CardDescription>{mission.address}</CardDescription>
                    </div>
                    <Badge variant="destructive">Live</Badge>
                  </div>
                  <Button variant="secondary" size="sm" className="mt-2 w-full">Join Mission</Button>
                </CardContent>
              </Card>
            )) : <p className="text-xs text-muted-foreground px-2">No active missions.</p>}
          </div>
          <div>
            <h3 className="font-semibold mb-2 px-2">Upcoming</h3>
            {upcomingMissions.length > 0 ? upcomingMissions.map((mission, index) => (
              <Card key={index} className="mb-2 bg-card/50">
                <CardContent className="p-3">
                    <CardTitle className="text-base">{mission.title}</CardTitle>
                    <CardDescription>{mission.displayTime}</CardDescription>
                </CardContent>
              </Card>
            )) : <p className="text-xs text-muted-foreground px-2">No upcoming missions.</p>}
          </div>
          <div>
            <h3 className="font-semibold mb-2 px-2">Recent</h3>
             {recentMissions.length > 0 ? recentMissions.map((mission, index) => (
              <Card key={index} className="mb-2 bg-card/30 border-dashed">
                <CardContent className="p-3">
                    <CardTitle className="text-base">{mission.title}</CardTitle>
                    <CardDescription>{mission.displayTime}</CardDescription>
                </CardContent>
              </Card>
            )) : <p className="text-xs text-muted-foreground px-2">No recent missions.</p>}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
