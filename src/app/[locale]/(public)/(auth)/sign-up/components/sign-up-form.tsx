"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ClerkForm } from "@/components/clerk-form";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/providers/app-auth-provider";
import { useTranslations } from "next-intl";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error
    ? error.message
    : fallback;
}

export function SignUpForm() {
  const t = useTranslations("auth");
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const locale = pathname.split("/")[1] || "fr";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (auth.status === "loading") return;

    setError(null);
    setIsSubmitting(true);

    try {
      await auth.signUpWithPassword({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      });
      setIsVerifying(true);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, t("errors.registrationFailed")));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerification(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (auth.status === "loading") return;

    setError(null);
    setIsSubmitting(true);

    try {
      await auth.verifySignUpEmail(verificationCode.trim());
      router.replace(`/${locale}/protected`);
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, t("errors.verificationFailed")));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isVerifying) {
    return (
      <Form
        onSubmit={handleVerification}
        actions={
          <>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("verifying") : t("verifyEmail")}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setError(null);
                setVerificationCode("");
                setIsVerifying(false);
                void auth.resetSignUp();
              }}
              disabled={isSubmitting}
            >
              {t("back")}
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-500">
          {t.rich("verificationCodeSent", {
            email,
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>

        {error ? (
          <p
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="verification-code">{t("verificationCode")}</Label>
          <Input
            id="verification-code"
            name="verification-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={verificationCode}
            onChange={(event) => setVerificationCode(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </Form>
    );
  }

  return (
    <ClerkForm
      onSubmit={handleRegistration}
      actions={
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={auth.status === "loading" || isSubmitting}
        >
          {isSubmitting ? t("creatingAccount") : t("createAccount")}
        </Button>
      }
    >
      {error ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
        >
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">{t("firstName")}</Label>
          <Input
            id="first-name"
            name="first-name"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">{t("lastName")}</Label>
          <Input
            id="last-name"
            name="last-name"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          disabled={isSubmitting}
        />
      </div>
    </ClerkForm>
  );
}
