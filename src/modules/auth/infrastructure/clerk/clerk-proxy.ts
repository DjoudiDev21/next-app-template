import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { requireClerkPublishableKey } from './public-clerk-config';

const supportedLocales = ['en', 'fr', 'es'];
const defaultLocale = 'fr';
const protectedRoutePattern = /^\/(?:en|fr|es)\/(?:protected)(?:\/|$)/;

const publishableKey = requireClerkPublishableKey();
const secretKey = process.env.CLERK_SECRET_KEY;

if (!secretKey) {
  throw new Error(
    'CLERK_SECRET_KEY is required. Clerk keyless mode is disabled.',
  );
}

export default clerkMiddleware(
  async (auth, request) => {
    const pathname = request.nextUrl.pathname;
    const hasLocale = supportedLocales.some(
      (locale) =>
        pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    );

    if (!hasLocale) {
      const localizedPath =
        pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;

      return NextResponse.redirect(new URL(localizedPath, request.url));
    }

    if (protectedRoutePattern.test(pathname)) {
      await auth.protect();
    }
  },
  { publishableKey, secretKey },
);
