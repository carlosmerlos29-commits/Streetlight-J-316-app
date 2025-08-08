
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { useEvents, AppEvent } from '@/app/(main)/layout';
import { useMemo } from 'react';

function getEventStatus(event: AppEvent) {
    const now = new Date();
    const eventDateTime = new Date(event.date);
    const [hours, minutes] = event.time.split(':').map(Number);
    eventDateTime.setHours(hours);
    eventDateTime.setMinutes(minutes);

    if (now < eventDateTime) {
        return 'upcoming';
    }

    const diffHours = (now.getTime() - eventDateTime.getTime()) / (1000 * 60 * 60);
    if (diffHours <= 2) return 'active';
    
    return 'recent';
}

function formatTime(event: AppEvent) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDate = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate());

    const [hours, minutes] = event.time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    const timeString = `${displayHours}:${displayMinutes} ${ampm}`;

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
        const [aHours, aMinutes] = a.time.split(':').map(Number);
        aDate.setHours(aHours, aMinutes);

        const bDate = new Date(b.date);
        const [bHours, bMinutes] = b.time.split(':').map(Number);
        bDate.setHours(bHours, bMinutes);
        
        // Sort recent/active events to be descending (most recent first)
        if (a.status === 'recent' || a.status === 'active') {
            return bDate.getTime() - aDate.getTime();
        }
        // Sort upcoming events to be ascending (closest first)
        return aDate.getTime() - bDate.getTime();
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
