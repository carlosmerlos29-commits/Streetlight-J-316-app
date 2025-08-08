
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { resources } from '@/lib/resources';
import Link from 'next/link';

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">Biblioteca de Recursos</h1>
        <p className="text-muted-foreground">Herramientas y guías descargables para ayudar a tu ministerio.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource) => (
          <Card key={resource.slug} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
                <resource.icon className="h-8 w-8 text-primary" />
                <div>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.type}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{resource.description}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/resources/${resource.slug}`} className="w-full">
                <Button className="w-full">
                  Ver Recurso <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

    