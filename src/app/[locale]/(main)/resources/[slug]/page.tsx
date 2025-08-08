
'use client';

import { useParams } from 'next/navigation';
import { resources, Resource } from '@/lib/resources';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const ResourcePageContent = ({ resource }: { resource: Resource }) => {
  switch (resource.type) {
    case 'Video':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{resource.pageTitle}</CardTitle>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center">
              <video
                className="w-full h-full"
                src="https://placehold.co/1920x1080.mp4"
                poster="https://placehold.co/1920x1080.png"
                controls
                data-ai-hint="gospel video"
              >
                Tu navegador no soporta la etiqueta de video.
              </video>
            </div>
            <div className="mt-6 prose prose-stone dark:prose-invert max-w-none">
              <p>{resource.content}</p>
            </div>
          </CardContent>
        </Card>
      );
    case 'PDF':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{resource.pageTitle}</CardTitle>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
             <div className="p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                <resource.icon className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground mb-6">Este recurso está disponible como un PDF descargable.</p>
                <Button size="lg">
                    <Download className="mr-2 h-5 w-5" />
                    Descargar PDF
                </Button>
             </div>
             <div className="mt-6 prose prose-stone dark:prose-invert max-w-none text-left">
              <p>{resource.content}</p>
            </div>
          </CardContent>
        </Card>
      );
    case 'Guide':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{resource.pageTitle}</CardTitle>
            <CardDescription>{resource.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-stone dark:prose-invert max-w-none">
             <p>{resource.content}</p>
            </div>
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
};


export default function ResourceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const resource = resources.find((r) => r.slug === slug);

  if (!resource) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Recurso no encontrado</h1>
        <p className="text-muted-foreground">El recurso que buscas no existe.</p>
        <Link href="/resources">
            <Button variant="link" className="mt-4">Volver a Recursos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link href="/resources" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la Biblioteca de Recursos
        </Link>
        <div className="flex items-center gap-4">
            <resource.icon className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl font-bold">{resource.title}</h1>
        </div>
      </div>
      <ResourcePageContent resource={resource} />
    </div>
  );
}

    