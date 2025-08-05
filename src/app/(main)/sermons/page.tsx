
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Mic, CalendarDays } from 'lucide-react';

export default function SermonsPage() {

  const sermons = [
    { 
      title: "The Sermon on the Mount: The Beatitudes", 
      speaker: "Pastor John Doe", 
      date: "2024-07-21", 
      videoUrl: "#", 
      audioUrl: "#" 
    },
    { 
      title: "The Parable of the Good Samaritan", 
      speaker: "Pastor Jane Smith", 
      date: "2024-07-14", 
      videoUrl: "#", 
      audioUrl: "#" 
    },
    { 
      title: "The Parable of the Prodigal Son", 
      speaker: "Pastor John Doe", 
      date: "2024-07-07", 
      videoUrl: "#", 
      audioUrl: "#" 
    },
    { 
      title: "Understanding Grace", 
      speaker: "Guest Speaker Michael Chen", 
      date: "2024-06-30", 
      videoUrl: null, 
      audioUrl: "#" 
    },
    { 
      title: "Faith That Moves Mountains", 
      speaker: "Pastor Jane Smith", 
      date: "2024-06-23", 
      videoUrl: "#", 
      audioUrl: null
    },
     { 
      title: "Living a Life of Purpose", 
      speaker: "Pastor John Doe", 
      date: "2024-06-16", 
      videoUrl: "#", 
      audioUrl: "#" 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Sermons</h1>
        <p className="text-muted-foreground">Watch and listen to recent messages from our team.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sermons.map((sermon, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
                <CardTitle>{sermon.title}</CardTitle>
                <CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs">{sermon.speaker}</span>
                    <span className="flex items-center gap-1.5 text-xs">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(sermon.date).toLocaleDateString()}
                    </span>
                  </div>
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm">
                Join us as we explore deep truths from the scriptures and learn how to apply them to our daily lives.
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
                {sermon.videoUrl && (
                    <Button className="w-full">
                        <PlayCircle className="mr-2 h-4 w-4" /> Watch
                    </Button>
                )}
                {sermon.audioUrl && (
                    <Button variant="outline" className="w-full">
                        <Mic className="mr-2 h-4 w-4" /> Listen
                    </Button>
                )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
