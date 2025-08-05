
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Video, BookOpen, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ResourcesPage() {
  const t = useTranslations('Resources');

  const resources = [
    { title: t('items.gospelTract.title'), description: t('items.gospelTract.description'), icon: FileText, type: 'PDF' },
    { title: t('items.evangelism101.title'), description: t('items.evangelism101.description'), icon: Video, type: t('types.video') },
    { title: t('items.streetPreaching.title'), description: t('items.streetPreaching.description'), icon: BookOpen, type: t('types.guide') },
    { title: t('items.bridgeIllustration.title'), description: t('items.bridgeIllustration.description'), icon: FileText, type: 'PDF' },
    { title: t('items.followUp.title'), description: t('items.followUp.description'), icon: BookOpen, type: t('types.guide') },
    { title: t('items.testimonyWorkshop.title'), description: t('items.testimonyWorkshop.description'), icon: Video, type: t('types.video') },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((resource, index) => (
          <Card key={index} className="flex flex-col">
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
              <Button className="w-full">
                <Download className="mr-2 h-4 w-4" /> {t('downloadButton')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
