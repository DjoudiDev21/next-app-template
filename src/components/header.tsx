"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/app-auth-provider";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useTranslations } from "next-intl";

function localeFromPath(pathname: string) {
  return pathname.match(/^\/(en|fr|es)(?:\/|$)/)?.[1] ?? "fr";
}

export function Header() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const auth = useAuth();
  const t = useTranslations("auth");

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={`/${locale}`} className="font-bold">
          Next Auth Template
        </Link>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          {auth.status === "authenticated" ? (
            <>
              <Link href={`/${locale}/protected`}>Protected</Link>
              {auth.identity?.avatarUrl ? (
                <Image
                  src={auth.identity.avatarUrl}
                  alt={auth.identity.displayName ?? "Account"}
                  width={32}
                  height={32}
                  className="rounded-full"
                  unoptimized
                />
              ) : null}
              <button
                type="button"
                onClick={() => void auth.signOut()}
                className="rounded-md bg-slate-900 px-3 py-2 text-sm text-white dark:bg-white dark:text-slate-900"
              >
                {t("signOut")}
              </button>
            </>
          ) : (
            <>
              <Link href={`/${locale}/sign-in`}>{t("signIn")}</Link>
              <Link
                href={`/${locale}/sign-up`}
                className="rounded-md bg-primary px-3 py-2 text-sm text-white"
              >
                {t("signUp")}
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
