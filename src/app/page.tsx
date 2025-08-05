
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome, Apple } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <h1 className="font-headline text-4xl font-bold text-primary">Streetlight J-316</h1>
          <CardDescription>Lighting the way for modern evangelism.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.doe@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full font-bold">Login</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="#" className="underline">
              Forgot your password?
            </Link>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              <Chrome className="mr-2 h-4 w-4" /> Sign in with Google
            </Button>
            <Button variant="outline" className="w-full">
              <Apple className="mr-2 h-4 w-4" /> Sign in with Apple
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 text-center">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{' '}
            <Link href="#" className="underline font-medium text-primary">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

    