

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome, Apple, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';


export default function LoginPage() {
  const t = useTranslations('Login');
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const auth = getAuth(app);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login Error:', error);
      toast({
        title: t('toast.loginFailedTitle'),
        description: error.message || t('toast.loginFailedDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        router.push('/dashboard');
    } catch (error: any) {
        console.error("Google Sign-In Error: ", error);
        toast({
            title: t('toast.googleFailedTitle'),
            description: error.message || t('toast.googleFailedDescription'),
            variant: "destructive",
        });
    } finally {
        setIsGoogleLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    const provider = new OAuthProvider('apple.com');
    try {
        await signInWithPopup(auth, provider);
        router.push('/dashboard');
    } catch (error: any) {
        console.error("Apple Sign-In Error: ", error);
         toast({
            title: t('toast.appleFailedTitle'),
            description: error.message || t('toast.appleFailedDescription'),
            variant: "destructive",
        });
    } finally {
        setIsAppleLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <h1 className="font-headline text-4xl font-bold text-primary">{t('mainTitle')}</h1>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isGoogleLoading || isAppleLoading}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('passwordLabel')}</Label>
              <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isGoogleLoading || isAppleLoading}/>
            </div>
            <Button type="submit" className="w-full font-bold" disabled={isLoading || isGoogleLoading || isAppleLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('loginButton')}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="#" className="underline">
              {t('forgotPasswordLink')}
            </Link>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading || isAppleLoading}>
              {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />} 
              {t('googleButton')}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleAppleSignIn} disabled={isLoading || isGoogleLoading || isAppleLoading}>
              {isAppleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Apple className="mr-2 h-4 w-4" />}
               {t('appleButton')}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 text-center">
          <p className="text-xs text-muted-foreground">
            {t('signupPrompt')}{' '}
            <Link href="/signup" className="underline font-medium text-primary">
              {t('signupLink')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
