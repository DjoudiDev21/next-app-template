import type { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

export default function WebsiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
