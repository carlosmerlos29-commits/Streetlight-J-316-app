
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ListFilter, RadioTower } from 'lucide-react';

export default function LiveMapPage() {
  return (
    <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold">Live Mission Map</h1>
          <p className="text-muted-foreground">View active missions and user locations in real-time.</p>
        </div>
        <Card className="flex-grow">
          <CardContent className="h-full p-2">
            <div className="relative h-full w-full rounded-lg overflow-hidden border bg-muted">
              <Image
                src="https://placehold.co/1200x800.png"
                alt="Live mission map"
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
                data-ai-hint="world map"
              />
              <div className="absolute top-4 right-4 z-10">
                  <Card className="max-w-xs">
                      <CardHeader>
                          <CardTitle>Real-Time Controls</CardTitle>
                          <CardDescription>Manage your live presence.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="flex items-center justify-between space-x-2">
                              <Label htmlFor="geo-sharing" className="flex items-center gap-2">
                                  <RadioTower className="h-4 w-4" />
                                  <span>Share My Location</span>
                              </Label>
                              <Switch id="geo-sharing" />
                          </div>
                           <Button variant="outline" className="w-full"><ListFilter className="mr-2 h-4 w-4" /> Filter Missions</Button>
                      </CardContent>
                  </Card>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
