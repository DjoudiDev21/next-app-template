import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const supportedLocales = ['en', 'fr', 'es'];
const defaultLocale = 'fr';
const protectedRoutePattern = /^\/(?:en|fr|es)\/(?:protected)(?:\/|$)/;

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  const hasLocale = supportedLocales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (!hasLocale) {
    const localizedPath =
      pathname === '/' ? `/${defaultLocale}` : `/${defaultLocale}${pathname}`;

    return NextResponse.redirect(new URL(localizedPath, request.url));
  }

  if (protectedRoutePattern.test(pathname)) {
    await auth.protect();
  }
});
