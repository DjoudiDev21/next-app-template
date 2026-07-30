import { Link } from "@/i18n/navigation";
import { ROUTES } from "@/shared/lib/routes";
import { SignUpForm } from "../components/sign-up-form";
import { getTranslations } from "next-intl/server";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });

  return (
    <div className="grid min-h-[calc(100vh-8rem)] place-items-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("createAccount")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {t("signUpDescription")}
          </p>
        </div>

        <SignUpForm />

        <p className="mt-6 text-center text-sm text-slate-500">
          {t("alreadyHaveAccount")}{" "}
          <Link
            href={ROUTES.SIGN_IN}
            className="font-medium text-primary hover:underline"
          >
            {t("signIn")}
          </Link>
        </p>
      </section>
    </div>
  );
}
