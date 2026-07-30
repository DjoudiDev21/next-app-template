import type { ReactNode } from "react";
import { AuthHeader } from "@/components/auth-header";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <AuthHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
