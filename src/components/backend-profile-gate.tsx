'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/app-auth-provider';
import { ROUTES } from '@/shared/lib/routes';

export function BackendProfileGate({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const t = useTranslations('auth.backendSync');
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split('/')[1] || 'fr';

  if (auth.backendProfile.status === 'authenticated') return children;

  const isWaiting =
    auth.backendProfile.status === 'loading' ||
    auth.backendProfile.status === 'provisioning';
  const isUnauthorized =
    auth.backendProfile.status === 'unauthorized' ||
    auth.backendProfile.status === 'anonymous';

  async function reconnect() {
    await auth.signOut();
    router.replace(`/${locale}${ROUTES.SIGN_IN}`);
  }

  return (
    <section className="mx-auto flex min-h-[60vh] max-w-lg items-center px-6 py-16">
      <div
        role={isWaiting ? 'status' : 'alert'}
        className="w-full space-y-4 rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950"
      >
        <h1 className="text-xl font-semibold">
          {isWaiting
            ? t('provisioningTitle')
            : isUnauthorized
              ? t('sessionExpiredTitle')
              : t('failedTitle')}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {isWaiting
            ? t('provisioningDescription')
            : isUnauthorized
              ? t('sessionExpiredDescription')
              : t('failedDescription')}
        </p>
        {!isWaiting ? (
          <Button
            type="button"
            onClick={() =>
              isUnauthorized ? void reconnect() : auth.retryBackendProfile()
            }
          >
            {isUnauthorized ? t('signInAgain') : t('retry')}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
