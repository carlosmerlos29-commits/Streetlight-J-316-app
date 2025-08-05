
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Mic, CalendarDays } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SermonsPage() {
  const t = useTranslations('Sermons');

  const sermons = [
    { 
      title: t('items.sermonOnTheMount.title'), 
      speaker: "Pastor John Doe", 
      date: "2024-07-21", 
      videoUrl: "#", 
      audioUrl: "#" 
    },
    { 
      title: t('items.goodSamaritan.title'), 
      speaker: "Pastor Jane Smith", 
      date: "2024-07-14", 
      videoUrl: "#", 
      audioUrl: "#" 
    },
    { 
      title: t('items.prodigalSon.title'), 
      speaker: "Pastor John Doe", 
      date: "2024-07-07", 
      videoUrl: "#", 
      audioUrl: "#" 
    },
    { 
      title: t('items.understandingGrace.title'), 
      speaker: t('items.understandingGrace.speaker'), 
      date: "2024-06-30", 
      videoUrl: null, 
      audioUrl: "#" 
    },
    { 
      title: t('items.faithThatMovesMountains.title'), 
      speaker: "Pastor Jane Smith", 
      date: "2024-06-23", 
      videoUrl: "#", 
      audioUrl: null
    },
     { 
      title: t('items.lifeOfPurpose.title'), 
      speaker: "Pastor John Doe", 
      date: "2024-06-16", 
      videoUrl: "#", 
      audioUrl: "#" 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
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
                {t('itemDescription')}
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
                {sermon.videoUrl && (
                    <Button className="w-full">
                        <PlayCircle className="mr-2 h-4 w-4" /> {t('watchButton')}
                    </Button>
                )}
                {sermon.audioUrl && (
                    <Button variant="outline" className="w-full">
                        <Mic className="mr-2 h-4 w-4" /> {t('listenButton')}
                    </Button>
                )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
