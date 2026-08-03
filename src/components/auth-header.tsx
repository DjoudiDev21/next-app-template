import { LocaleSwitcher } from '@/components/locale-switcher';
import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/shared/lib/routes';

export function AuthHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={ROUTES.HOME} className="font-bold">
          Next Auth Template
        </Link>
        <LocaleSwitcher />
      </nav>
    </header>
  );
}
