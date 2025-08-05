
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

const missions = [
  { status: 'active', title: 'Downtown Outreach', time: 'Live Now', location: 'City Center' },
  { status: 'upcoming', title: 'Campus Ministry', time: 'Tomorrow at 2 PM', location: 'State University' },
  { status: 'upcoming', title: 'Park Evangelism', time: 'July 28th at 11 AM', location: 'Central Park' },
  { status: 'recent', title: 'Prayer Walk', time: 'Yesterday at 6 PM', location: 'Neighborhood' },
  { status: 'recent', title: 'Homeless Shelter Service', time: 'July 24th at 5 PM', location: 'Good Samaritan Shelter' },
];

export function UpcomingMissions() {
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
            {missions.filter(m => m.status === 'active').map((mission, index) => (
              <Card key={index} className="mb-2">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">{mission.title}</CardTitle>
                      <CardDescription>{mission.location}</CardDescription>
                    </div>
                    <Badge variant="destructive">Live</Badge>
                  </div>
                  <Button variant="secondary" size="sm" className="mt-2 w-full">Join Mission</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2 px-2">Upcoming</h3>
            {missions.filter(m => m.status === 'upcoming').map((mission, index) => (
              <Card key={index} className="mb-2 bg-card/50">
                <CardContent className="p-3">
                    <CardTitle className="text-base">{mission.title}</CardTitle>
                    <CardDescription>{mission.time}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2 px-2">Recent</h3>
             {missions.filter(m => m.status === 'recent').map((mission, index) => (
              <Card key={index} className="mb-2 bg-card/30 border-dashed">
                <CardContent className="p-3">
                    <CardTitle className="text-base">{mission.title}</CardTitle>
                    <CardDescription>{mission.time}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
