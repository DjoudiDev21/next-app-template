import { Link } from '@/i18n/navigation';
import { ROUTES } from '@/shared/lib/routes';
import { SignInForm } from '../components/sign-in-form';
import { getTranslations } from 'next-intl/server';

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });

  return (
    <div className="grid min-h-[calc(100vh-8rem)] place-items-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('signIn')}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {t('signInDescription')}
          </p>
        </div>

        <SignInForm />

        <p className="mt-6 text-center text-sm text-slate-500">
          {t('dontHaveAccount')}{' '}
          <Link
            href={ROUTES.SIGN_UP}
            className="font-medium text-primary hover:underline"
          >
            {t('createAccount')}
          </Link>
        </p>
      </section>
    </div>
  );
}
