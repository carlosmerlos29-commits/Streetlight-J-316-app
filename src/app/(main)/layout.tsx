
'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { app } from '@/lib/firebase';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Wand2,
  Map,
  Library,
  CalendarDays,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Users,
  Loader2,
  Clapperboard,
} from 'lucide-react';
import { UpcomingMissions } from '@/components/upcoming-missions';

export interface AppEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
  type: 'Outreach' | 'Worship' | 'Training' | 'Community';
  time: string;
  address: string;
}

const initialEvents: AppEvent[] = [
    { id: '1', date: new Date(new Date().getTime() - 2 * 60 * 60 * 1000), title: 'Fairfax County Courthouse Outreach', description: 'Handing out tracts and engaging in conversations near the courthouse.', type: 'Outreach', time: '11:00', address: '4110 Chain Bridge Rd, Fairfax, VA 22030' },
    { id: '2', date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), title: 'George Mason University Campus Meetup', description: 'Connecting with students on campus and sharing the Gospel.', type: 'Community', time: '14:00', address: '4400 University Dr, Fairfax, VA 22030' },
    { id: '3', date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), title: 'Community Cookout at Burke Lake Park', description: 'A friendly community event with free food and fellowship.', type: 'Community', time: '13:00', address: '7315 Ox Rd, Fairfax Station, VA 22039' },
];


interface EventsContextType {
  events: AppEvent[];
  addEvent: (event: AppEvent) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export const EventsProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<AppEvent[]>(initialEvents);

  const addEvent = (event: AppEvent) => {
    setEvents(prevEvents => [...prevEvents, event].sort((a,b) => a.date.getTime() - b.date.getTime()));
  };

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
};


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <EventsProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Link href="/live-map" className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary">
                <Wand2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-headline text-xl font-semibold">Streetlight J-316</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard" passHref>
                  <SidebarMenuButton tooltip="AI Mission Planner">
                    <Wand2 />
                    <span>AI Mission Planner</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/live-map" passHref>
                  <SidebarMenuButton tooltip="Live Mission Map">
                    <Map />
                    <span>Live Mission Map</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/team-chat" passHref>
                  <SidebarMenuButton tooltip="Team Chat">
                    <MessageSquare />
                    <span>Team Chat</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/sermons" passHref>
                  <SidebarMenuButton tooltip="Sermons">
                    <Clapperboard />
                    <span>Sermons</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/resources" passHref>
                  <SidebarMenuButton tooltip="Resource Library">
                    <Library />
                    <span>Resource Library</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/events" passHref>
                  <SidebarMenuButton tooltip="Community Events">
                    <CalendarDays />
                    <span>Community Events</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/support" passHref>
                  <SidebarMenuButton tooltip="Support">
                    <LifeBuoy />
                    <span>Support</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="flex-col items-start gap-4">
              <Link href="/profile" passHref className="w-full">
                <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.photoURL || "https://placehold.co/40x40.png"} alt="User Avatar" data-ai-hint="man portrait"/>
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold">{user?.displayName || "User"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start gap-2 px-2" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1" />
            <SidebarTrigger className="md:hidden" data-sidebar-for="right-sidebar" />
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
        <Sidebar side="right" id="right-sidebar" collapsible="offcanvas">
          <UpcomingMissions />
        </Sidebar>
      </SidebarProvider>
    </EventsProvider>
  );
}
