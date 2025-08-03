import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListFilter } from 'lucide-react';

export default function LiveMapPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Live Mission Map</h1>
        <p className="text-muted-foreground">View active missions and user locations in real-time.</p>
      </div>
      <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle>Mission Activity</CardTitle>
                    <CardDescription>A live overview of evangelism efforts.</CardDescription>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Input placeholder="Search location..." className="w-full sm:w-auto" />
                    <Button variant="outline"><ListFilter className="mr-2 h-4 w-4" /> Filter</Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border bg-muted">
            <Image
              src="https://placehold.co/1200x675.png"
              alt="Live mission map"
              width={1200}
              height={675}
              className="w-full h-full object-cover"
              data-ai-hint="world map"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
