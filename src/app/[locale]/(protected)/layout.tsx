import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ROUTES } from "@/shared/lib/routes";
import { serverAuthRepository } from "@/modules/auth/infrastructure/repositories/clerk-server-auth.repository";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default async function ProtectedLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await serverAuthRepository.getSession();

  if (!session) {
    redirect(`/${locale}${ROUTES.SIGN_IN}`);
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
