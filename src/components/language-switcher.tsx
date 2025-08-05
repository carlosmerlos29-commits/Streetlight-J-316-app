
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function LanguageSwitcher() {
  const t = useTranslations('Sidebar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (value: string) => {
    // The pathname with the new locale, e.g., /es/dashboard
    const newPath = pathname.replace(`/${locale}`, `/${value}`);
    router.replace(newPath);
  };

  return (
    <div className="px-2 w-full">
        <Select onValueChange={onSelectChange} defaultValue={locale}>
        <SelectTrigger>
            <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
        </SelectContent>
        </Select>
    </div>
  );
}
