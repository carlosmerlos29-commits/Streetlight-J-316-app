
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { app } from '@/lib/firebase';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from 'firebase/firestore';

interface Message {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: Timestamp | null;
  isSelf: boolean;
}

export function TeamChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const db = getFirestore(app);
  const messagesCollection = collection(db, 'messages');

  useEffect(() => {
    const q = query(messagesCollection, orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          user: data.user,
          avatar: data.avatar,
          message: data.message,
          timestamp: data.timestamp,
          isSelf: data.user === 'You', // Simple check for demo purposes
        });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    await addDoc(messagesCollection, {
      user: 'You', // Hardcoded for now, should be dynamic in a real app
      avatar: 'https://placehold.co/40x40.png',
      message: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'Sending...';
    return new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Team Chat</CardTitle>
        <CardDescription>Coordinate with your team in real-time.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <ScrollArea className="flex-grow h-[calc(100vh-350px)] pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.isSelf ? 'justify-end' : ''}`}>
                {!msg.isSelf && (
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage src={msg.avatar} alt={msg.user} data-ai-hint="person portrait"/>
                    <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg p-3 max-w-[80%] ${msg.isSelf ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {!msg.isSelf && <p className="text-xs font-semibold mb-1">{msg.user}</p>}
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.isSelf ? 'text-primary-foreground/70' : 'text-muted-foreground/70'} ${msg.isSelf ? 'text-right' : 'text-left'}`}>{formatTimestamp(msg.timestamp)}</p>
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
        <form className="flex gap-2" onSubmit={handleSendMessage}>
          <Input 
            placeholder="Type a message..."
            className="flex-grow"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
