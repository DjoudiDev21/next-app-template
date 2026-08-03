'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

type Locale = 'en' | 'fr' | 'es';

const localeNames: Record<Locale, string> = {
  en: 'English (EN)',
  fr: 'Français (FR)',
  es: 'Español (ES)',
};

const localeShort: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
  es: 'ES',
};

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const handleLocaleChange = (newLocale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
      setIsOpen(false);
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 h-auto"
          disabled={isPending}
        >
          <span className="material-symbols-outlined text-lg hidden sm:block">
            language
          </span>
          <span className="text-xs font-bold">{localeShort[locale]}</span>
          <ChevronDownIcon className="h-3.5 w-3.5 group-hover:rotate-180 transition-transform" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-32 origin-top-right rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-0"
      >
        <div className="py-1">
          {Object.entries(localeNames).map(([localeCode, name]) => {
            const localeKey = localeCode as Locale;
            const isActive = localeKey === locale;
            return (
              <DropdownMenuItem
                key={localeCode}
                onClick={() => handleLocaleChange(localeKey)}
                className={`flex items-center px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'text-primary bg-primary/10 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                disabled={isActive}
              >
                {name}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
