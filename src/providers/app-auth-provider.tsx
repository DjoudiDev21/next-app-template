'use client';

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AuthenticatedFetchUseCase } from '@/modules/auth/application/use-cases/authenticated-fetch.use-case';
import {
  BackendAuthenticationError,
  GetCurrentUserUseCase,
} from '@/modules/auth/application/use-cases/get-current-user.use-case';
import { ResetSignUpUseCase } from '@/modules/auth/application/use-cases/reset-sign-up.use-case';
import { SignInUseCase } from '@/modules/auth/application/use-cases/sign-in.use-case';
import { SignOutUseCase } from '@/modules/auth/application/use-cases/sign-out.use-case';
import { SignUpUseCase } from '@/modules/auth/application/use-cases/sign-up.use-case';
import { VerifySignUpEmailUseCase } from '@/modules/auth/application/use-cases/verify-sign-up-email.use-case';
import type { AuthRepository } from '@/modules/auth/domain/interfaces/auth.repository';
import { AccessTokenUnavailableError } from '@/modules/auth/domain/entities/access-token.error';
import type { BackendProfileState } from '@/modules/auth/domain/entities/backend-user-profile.entity';
import { useClerkAuthRepository } from '@/modules/auth/infrastructure/repositories/clerk-auth.repository';
import { ClerkInfrastructureProvider } from '@/modules/auth/infrastructure/repositories/clerk-provider';

const AuthContext = createContext<AuthRepository | null>(null);
const AuthenticatedFetchContext =
  createContext<AuthenticatedFetchUseCase | null>(null);

function AuthCompositionProvider({ children }: { children: ReactNode }) {
  const authRepository = useClerkAuthRepository();
  const [backendResult, setBackendResult] = useState<{
    identityId: string | null;
    state: BackendProfileState;
  }>({
    identityId: null,
    state: { status: 'loading', profile: null, error: null },
  });
  const requestedIdentity = useRef<string | null>(null);
  const [provisioningAttempt, setProvisioningAttempt] = useState(0);
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
  const authenticatedFetch = useMemo(
    () => new AuthenticatedFetchUseCase(authRepository),
    [authRepository],
  );
  const getCurrentUser = useMemo(
    () =>
      new GetCurrentUserUseCase(
        authenticatedFetch.execute.bind(authenticatedFetch),
      ),
    [authenticatedFetch],
  );

  useEffect(() => {
    if (authRepository.status === 'loading') return;
    if (authRepository.status === 'anonymous' || !authRepository.identity) {
      requestedIdentity.current = null;
      return;
    }

    const identityId = authRepository.identity.id;
    if (requestedIdentity.current === identityId) return;
    requestedIdentity.current = identityId;
    const controller = new AbortController();

    void getCurrentUser.execute('authenticated', controller.signal).then(
      (profile) => {
        if (profile) {
          setBackendResult({
            identityId,
            state: { status: 'authenticated', profile, error: null },
          });
        }
      },
      (reason: unknown) => {
        if (controller.signal.aborted) return;
        const error =
          reason instanceof Error
            ? reason
            : new Error('Unknown network error.');
        setBackendResult({
          identityId,
          state: {
            status:
              error instanceof BackendAuthenticationError ||
              error instanceof AccessTokenUnavailableError
                ? 'unauthorized'
                : 'error',
            profile: null,
            error,
          },
        });
      },
    );

    return () => {
      controller.abort();
      if (requestedIdentity.current === identityId) {
        requestedIdentity.current = null;
      }
    };
  }, [
    authRepository.identity,
    authRepository.status,
    getCurrentUser,
    provisioningAttempt,
  ]);

  const retryBackendProfile = useCallback(() => {
    requestedIdentity.current = null;
    setProvisioningAttempt((attempt) => attempt + 1);
  }, []);

  const backendProfile = useMemo<BackendProfileState>(
    () =>
      authRepository.status === 'loading'
        ? { status: 'loading', profile: null, error: null }
        : authRepository.status === 'anonymous' || !authRepository.identity
          ? { status: 'anonymous', profile: null, error: null }
          : backendResult.identityId === authRepository.identity.id
            ? backendResult.state
            : { status: 'provisioning', profile: null, error: null },
    [authRepository.identity, authRepository.status, backendResult],
  );

  const auth = useMemo<AuthRepository>(
    () => ({
      status: authRepository.status,
      identity: authRepository.identity,
      backendProfile,
      retryBackendProfile,
      getAccessToken: authRepository.getAccessToken,
      signInWithPassword: (email, password) =>
        useCases.signIn.execute({ email, password }),
      signUpWithPassword: (input) => useCases.signUp.execute(input),
      verifySignUpEmail: (code) => useCases.verifySignUpEmail.execute(code),
      resetSignUp: () => useCases.resetSignUp.execute(),
      signOut: () => useCases.signOut.execute(),
    }),
    [authRepository, backendProfile, retryBackendProfile, useCases],
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
    throw new Error('useAuth must be used within AppAuthProvider.');
  }

  return repository;
}

export function useAuthenticatedFetch() {
  const useCase = useContext(AuthenticatedFetchContext);

  if (!useCase) {
    throw new Error(
      'useAuthenticatedFetch must be used within AppAuthProvider.',
    );
  }

  return useCase.execute.bind(useCase);
}
