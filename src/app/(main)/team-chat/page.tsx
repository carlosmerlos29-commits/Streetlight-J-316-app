

import { TeamChat } from '@/components/team-chat';
import { useTranslations } from 'next-intl';

export default function TeamChatPage() {
  const t = useTranslations('TeamChat');
  return (
    <div className="h-full flex flex-col">
        <div className="mb-6">
          <h1 className="font-headline text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <div className="flex-grow">
            <TeamChat />
        </div>
    </div>
  );
}
