import type { Metadata } from 'next';
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
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'StreetLight Dashboard',
  description: 'Your dashboard for mission planning and execution.',
};

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary">
              <Wand2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-headline text-xl font-semibold">StreetLight</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" passHref>
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
                  <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="man portrait"/>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-semibold">User</p>
                  <p className="text-xs text-muted-foreground">user@email.com</p>
                </div>
              </Button>
            </Link>
            <Link href="/login" passHref className="w-full">
                <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
            </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
          <SidebarTrigger className="md:hidden" />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
