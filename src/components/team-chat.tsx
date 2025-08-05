
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

const messages = [
  {
    user: 'John D.',
    avatar: 'https://placehold.co/40x40.png',
    message: 'Team, heading to the town square now. Anyone else nearby?',
    timestamp: '10:30 AM',
    isSelf: false,
  },
  {
    user: 'You',
    avatar: 'https://placehold.co/40x40.png',
    message: 'I can be there in 15 minutes! Need any extra tracts?',
    timestamp: '10:31 AM',
    isSelf: true,
  },
  {
    user: 'Sarah P.',
    avatar: 'https://placehold.co/40x40.png',
    message: 'Just finished up at the university campus. Praying for you all!',
    timestamp: '10:32 AM',
    isSelf: false,
  },
    {
    user: 'Mark T.',
    avatar: 'https://placehold.co/40x40.png',
    message: 'Great work today everyone. Let\'s gather for a debrief at 5 PM.',
    timestamp: '4:15 PM',
    isSelf: false,
  },
];

export function TeamChat() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Team Chat</CardTitle>
        <CardDescription>Coordinate with your team in real-time.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <ScrollArea className="flex-grow h-[calc(100vh-350px)] pr-4">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start gap-3 ${msg.isSelf ? 'justify-end' : ''}`}>
                {!msg.isSelf && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={msg.avatar} alt={msg.user} data-ai-hint="person portrait"/>
                    <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg p-3 max-w-[80%] ${msg.isSelf ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {!msg.isSelf && <p className="text-xs font-semibold mb-1">{msg.user}</p>}
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.isSelf ? 'text-primary-foreground/70' : 'text-muted-foreground/70'} ${msg.isSelf ? 'text-right' : 'text-left'}`}>{msg.timestamp}</p>
                </div>
                 {msg.isSelf && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={msg.avatar} alt={msg.user} data-ai-hint="man portrait"/>
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <form className="flex gap-2">
          <Input placeholder="Type a message..." className="flex-grow" />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
