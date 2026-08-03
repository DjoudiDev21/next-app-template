import React from 'react';
import type { Metadata } from 'next';
import { AppAuthProvider } from '@/providers/app-auth-provider';

export const metadata: Metadata = {
  title: 'Next Auth Template',
  description: 'Provider-neutral authentication template for Next.js.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col overflow-x-hidden antialiased">
        <AppAuthProvider>{children}</AppAuthProvider>
      </body>
    </html>
  );
}
