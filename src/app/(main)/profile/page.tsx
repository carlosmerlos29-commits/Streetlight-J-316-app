

'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getAuth, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const t = useTranslations('Profile');
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, [auth]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.photoURL || "https://placehold.co/100x100.png"} alt={t('userAvatarAlt')} data-ai-hint="man portrait"/>
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user?.displayName || t('userName')}</h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
              <Button variant="outline">{t('changeAvatarButton')}</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('details.title')}</CardTitle>
              <CardDescription>{t('details.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t('details.usernameLabel')}</Label>
                <Input id="username" defaultValue={user?.displayName || t('userName')} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="bio">{t('details.bioLabel')}</Label>
                <Textarea id="bio" placeholder={t('details.bioPlaceholder')} defaultValue={t('details.bioDefaultValue')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verse">{t('details.verseLabel')}</Label>
                <Input id="verse" placeholder={t('details.versePlaceholder')} defaultValue="John 3:16" />
              </div>
              <Button>{t('details.saveButton')}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
