
'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';

export default function SupportPage() {
  const t = useTranslations('Support');

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('form.title')}</CardTitle>
          <CardDescription>{t('form.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{t('form.nameLabel')}</Label>
                    <Input id="name" placeholder={t('form.namePlaceholder')} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">{t('form.emailLabel')}</Label>
                    <Input id="email" type="email" placeholder={t('form.emailPlaceholder')} />
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">{t('form.subjectLabel')}</Label>
              <Select>
                <SelectTrigger id="subject">
                  <SelectValue placeholder={t('form.subjectPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">{t('form.subjects.bug')}</SelectItem>
                  <SelectItem value="feature">{t('form.subjects.feature')}</SelectItem>
                  <SelectItem value="question">{t('form.subjects.question')}</SelectItem>
                  <SelectItem value="other">{t('form.subjects.other')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">{t('form.messageLabel')}</Label>
              <Textarea id="message" placeholder={t('form.messagePlaceholder')} className="min-h-[120px]" />
            </div>
            <Button type="submit" className="w-full">{t('form.submitButton')}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
