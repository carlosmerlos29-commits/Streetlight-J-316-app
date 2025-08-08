

import { TeamChat } from '@/components/team-chat';

export default function TeamChatPage() {
  return (
    <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold">Chat de Equipo</h1>
          <p className="text-muted-foreground">Coordina con tu equipo en tiempo real.</p>
        </div>
        <div className="flex-grow">
            <TeamChat />
        </div>
    </div>
  );
}
