'use client';

import {
  useAuth as useClerkAuth,
  useSignIn,
  useSignUp,
  useUser,
} from '@clerk/nextjs';
import { useMemo } from 'react';
import type { AuthRepository } from '@/modules/auth';

export function useClerkAuthRepository(): AuthRepository {
  const { isLoaded, isSignedIn, userId, getToken, signOut } = useClerkAuth();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { user } = useUser();

  return useMemo<AuthRepository>(
    () => ({
      status: !isLoaded
        ? 'loading'
        : isSignedIn
          ? 'authenticated'
          : 'anonymous',
      identity:
        isSignedIn && userId
          ? {
              id: userId,
              email: user?.primaryEmailAddress?.emailAddress ?? null,
              displayName: user?.fullName ?? null,
              firstName: user?.firstName ?? null,
              lastName: user?.lastName ?? null,
              avatarUrl: user?.imageUrl ?? null,
            }
          : null,
      backendProfile: {
        status: !isLoaded
          ? 'loading'
          : isSignedIn
            ? 'provisioning'
            : 'anonymous',
        profile: null,
        error: null,
      },
      retryBackendProfile: () => {},
      getAccessToken: ({ forceRefresh } = {}) =>
        getToken({ skipCache: forceRefresh }),
      signInWithPassword: async (email, password) => {
        const { error } = await signIn.password({
          emailAddress: email,
          password,
        });

        if (error) {
          throw new Error(error.longMessage ?? error.message);
        }

        if (signIn.status !== 'complete') {
          throw new Error('Additional verification is required.');
        }

        const finalized = await signIn.finalize();

        if (finalized.error) {
          throw new Error(
            finalized.error.longMessage ?? finalized.error.message,
          );
        }
      },
      signUpWithPassword: async ({ firstName, lastName, email, password }) => {
        const { error } = await signUp.password({
          firstName,
          lastName,
          emailAddress: email,
          password,
        });

        if (error) {
          throw new Error(error.longMessage ?? error.message);
        }

        const verification = await signUp.verifications.sendEmailCode();

        if (verification.error) {
          throw new Error(
            verification.error.longMessage ?? verification.error.message,
          );
        }
      },
      verifySignUpEmail: async (code) => {
        const { error } = await signUp.verifications.verifyEmailCode({ code });

        if (error) {
          throw new Error(error.longMessage ?? error.message);
        }

        if (signUp.status !== 'complete') {
          throw new Error('Your account could not be activated.');
        }

        const finalized = await signUp.finalize();

        if (finalized.error) {
          throw new Error(
            finalized.error.longMessage ?? finalized.error.message,
          );
        }
      },
      resetSignUp: async () => {
        const { error } = await signUp.reset();

        if (error) {
          throw new Error(error.longMessage ?? error.message);
        }
      },
      signOut: async () => {
        await signOut();
      },
    }),
    [getToken, isLoaded, isSignedIn, signIn, signOut, signUp, user, userId],
  );
}
