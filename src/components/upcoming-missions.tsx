

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { useEvents, AppEvent } from '@/app/(main)/layout';
import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

function getEventStatus(event: AppEvent) {
    const now = new Date();
    const eventDateTime = new Date(event.date);
    const [hours, minutes] = event.time.split(':').map(Number);
    eventDateTime.setHours(hours);
    eventDateTime.setMinutes(minutes);

    if (now < eventDateTime) {
      const diffHours = (eventDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (diffHours <= 24) return 'upcoming';
      return 'future';
    }

    const diffHours = (now.getTime() - eventDateTime.getTime()) / (1000 * 60 * 60);
    if (diffHours <= 2) return 'active';
    
    return 'recent';
}

function formatTime(event: AppEvent, t: (key: string, values?: any) => string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDate = new Date(event.date.getFullYear(), event.date.getMonth(), event.date.getDate());

    const [hours, minutes] = event.time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    const timeString = `${displayHours}:${displayMinutes} ${ampm}`;

    if (eventDate.getTime() === today.getTime()) {
        return t('time.today', { time: timeString });
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (eventDate.getTime() === tomorrow.getTime()) {
        return t('time.tomorrow', { time: timeString });
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (eventDate.getTime() === yesterday.getTime()) {
        return t('time.yesterday', { time: timeString });
    }
    
    return t('time.onDate', { date: event.date.toLocaleDateString(), time: timeString });
}

export function UpcomingMissions() {
  const t = useTranslations('MissionsPanel');
  const { events } = useEvents();

  const missions = useMemo(() => {
    return events.map(event => ({
      ...event,
      status: getEventStatus(event),
      displayTime: formatTime(event, t),
    }));
  }, [events, t]);

  const activeMissions = missions.filter(m => m.status === 'active');
  const upcomingMissions = missions.filter(m => m.status === 'upcoming');
  const recentMissions = missions.filter(m => m.status === 'recent');


  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h2 className="text-2xl font-bold font-headline">{t('title')}</h2>
        <p className="text-sm text-muted-foreground">{t('description')}</p>
      </div>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-2 px-2">{t('active')}</h3>
            {activeMissions.length > 0 ? activeMissions.map((mission, index) => (
              <Card key={index} className="mb-2">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-base">{mission.title}</CardTitle>
                      <CardDescription>{mission.address}</CardDescription>
                    </div>
                    <Badge variant="destructive">{t('liveBadge')}</Badge>
                  </div>
                  <Button variant="secondary" size="sm" className="mt-2 w-full">{t('joinButton')}</Button>
                </CardContent>
              </Card>
            )) : <p className="text-xs text-muted-foreground px-2">{t('noActive')}</p>}
          </div>
          <div>
            <h3 className="font-semibold mb-2 px-2">{t('upcoming')}</h3>
            {upcomingMissions.length > 0 ? upcomingMissions.map((mission, index) => (
              <Card key={index} className="mb-2 bg-card/50">
                <CardContent className="p-3">
                    <CardTitle className="text-base">{mission.title}</CardTitle>
                    <CardDescription>{mission.displayTime}</CardDescription>
                </CardContent>
              </Card>
            )) : <p className="text-xs text-muted-foreground px-2">{t('noUpcoming')}</p>}
          </div>
          <div>
            <h3 className="font-semibold mb-2 px-2">{t('recent')}</h3>
             {recentMissions.length > 0 ? recentMissions.map((mission, index) => (
              <Card key={index} className="mb-2 bg-card/30 border-dashed">
                <CardContent className="p-3">
                    <CardTitle className="text-base">{mission.title}</CardTitle>
                    <CardDescription>{mission.displayTime}</CardDescription>
                </CardContent>
              </Card>
            )) : <p className="text-xs text-muted-foreground px-2">{t('noRecent')}</p>}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
