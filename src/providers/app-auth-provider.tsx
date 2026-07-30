"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { AuthenticatedFetchUseCase } from "@/modules/auth/application/use-cases/authenticated-fetch.use-case";
import { ResetSignUpUseCase } from "@/modules/auth/application/use-cases/reset-sign-up.use-case";
import { SignInUseCase } from "@/modules/auth/application/use-cases/sign-in.use-case";
import { SignOutUseCase } from "@/modules/auth/application/use-cases/sign-out.use-case";
import { SignUpUseCase } from "@/modules/auth/application/use-cases/sign-up.use-case";
import { VerifySignUpEmailUseCase } from "@/modules/auth/application/use-cases/verify-sign-up-email.use-case";
import type { AuthRepository } from "@/modules/auth/domain/interfaces/auth.repository";
import { useClerkAuthRepository } from "@/modules/auth/infrastructure/repositories/clerk-auth.repository";
import { ClerkInfrastructureProvider } from "@/modules/auth/infrastructure/repositories/clerk-provider";

const AuthContext = createContext<AuthRepository | null>(null);
const AuthenticatedFetchContext =
  createContext<AuthenticatedFetchUseCase | null>(null);

function AuthCompositionProvider({ children }: { children: ReactNode }) {
  const authRepository = useClerkAuthRepository();
  const useCases = useMemo(
    () => ({
      signIn: new SignInUseCase(authRepository),
      signUp: new SignUpUseCase(authRepository),
      verifySignUpEmail: new VerifySignUpEmailUseCase(authRepository),
      resetSignUp: new ResetSignUpUseCase(authRepository),
      signOut: new SignOutUseCase(authRepository),
    }),
    [authRepository],
  );
  const auth = useMemo<AuthRepository>(
    () => ({
      status: authRepository.status,
      identity: authRepository.identity,
      getAccessToken: authRepository.getAccessToken,
      signInWithPassword: (email, password) =>
        useCases.signIn.execute({ email, password }),
      signUpWithPassword: (input) => useCases.signUp.execute(input),
      verifySignUpEmail: (code) => useCases.verifySignUpEmail.execute(code),
      resetSignUp: () => useCases.resetSignUp.execute(),
      signOut: () => useCases.signOut.execute(),
    }),
    [authRepository, useCases],
  );
  const authenticatedFetch = useMemo(
    () => new AuthenticatedFetchUseCase(authRepository),
    [authRepository],
  );

  return (
    <AuthContext.Provider value={auth}>
      <AuthenticatedFetchContext.Provider value={authenticatedFetch}>
        {children}
      </AuthenticatedFetchContext.Provider>
    </AuthContext.Provider>
  );
}

export function AppAuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkInfrastructureProvider>
      <AuthCompositionProvider>{children}</AuthCompositionProvider>
    </ClerkInfrastructureProvider>
  );
}

export function useAuth(): AuthRepository {
  const repository = useContext(AuthContext);

  if (!repository) {
    throw new Error("useAuth must be used within AppAuthProvider.");
  }

  return repository;
}

export function useAuthenticatedFetch() {
  const useCase = useContext(AuthenticatedFetchContext);

  if (!useCase) {
    throw new Error(
      "useAuthenticatedFetch must be used within AppAuthProvider.",
    );
  }

  return useCase.execute.bind(useCase);
}
