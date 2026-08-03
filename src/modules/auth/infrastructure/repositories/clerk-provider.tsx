'use client';

import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import { requireClerkPublishableKey } from '../clerk/public-clerk-config';

export function ClerkInfrastructureProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={requireClerkPublishableKey()} dynamic>
      {children}
    </ClerkProvider>
  );
}
