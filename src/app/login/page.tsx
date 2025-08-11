
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, OAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/live-map');
    } catch (error) {
      console.error('Login Error:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, googleProvider);
      router.push('/live-map');
    } catch (error) {
      console.error('Google Sign-in Error:', error);
       toast({
        title: "Google Sign-in Failed",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGoogleLoading(false);
    }
  };
  
  const handleAppleSignIn = async () => {
    setIsAppleLoading(true);
    const appleProvider = new OAuthProvider('apple.com');
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithPopup(auth, appleProvider);
      router.push('/live-map');
    } catch (error) {
      console.error('Apple Sign-in Error:', error);
       toast({
        title: "Apple Sign-in Failed",
        description: "Could not sign in with Apple. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAppleLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Wand2 className="mx-auto h-12 w-12 text-primary" />
          <h1 className="font-headline text-4xl font-bold text-primary">Streetlight J-316</h1>
          <CardDescription>Lighting the way for modern evangelism.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="text-right">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full font-bold" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>
          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-muted" />
            <span className="mx-4 text-xs uppercase text-muted-foreground">or</span>
            <div className="flex-grow border-t border-muted" />
          </div>
          <div className="space-y-2">
             <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isGoogleLoading}>
              {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.5 173.5 58.1l-65.2 65.2C337.5 97.2 295.1 84 248 84c-89.8 0-162.5 72.7-162.5 162.5s72.7 162.5 162.5 162.5c98.3 0 148.2-67.9 152.8-102.3H248v-85.3h236.2c2.3 12.7 3.8 26.1 3.8 40.2z"></path>
                </svg>
              }
              Sign in with Google
            </Button>
            <Button variant="outline" className="w-full" onClick={handleAppleSignIn} disabled={isAppleLoading}>
              {isAppleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> :
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C39.2 141.6 0 184.2 0 241.2c0 61.6 31.5 118.8 80.1 142.6 20.7 13.7 42.5 19.7 62.2 19.7 16.9 0 36.2-5.2 56.1-15.4 17.6-9.1 31.5-24.3 50.8-24.3 15.8 0 30.1 10.5 45.3 10.5 15.4 0 34.3-6.8 52.8-18.2 21.6-13.7 34.3-33.5 34.3-55.8-.1-2.4-.1-4.7-.2-7.1zM256 48C202.9 48 160 82.6 160 133.6c0 4.1 1.1 8.2 3.1 12.1C182.5 106 222.2 72 256 72c33.8 0 73.5 34 54.2 89.5-21.3-33.5-54.2-54.2-88.2-54.2z"></path>
                </svg>
              }
              Sign in with Apple
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 text-center">
           <p className="text-xs text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="underline font-medium text-primary">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
