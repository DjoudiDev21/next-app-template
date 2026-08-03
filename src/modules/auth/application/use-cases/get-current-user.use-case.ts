import { BACKEND_URL } from '@/shared/config/backend';
import type { BackendUserProfile } from '../../domain/entities/backend-user-profile.entity';
import type { AuthStatus } from '../../domain/entities/auth-session.entity';

export class BackendAuthenticationError extends Error {
  constructor() {
    super('The backend rejected the Clerk session.');
    this.name = 'BackendAuthenticationError';
  }
}

export class BackendUserRequestError extends Error {
  constructor(status: number) {
    super(`Unable to load the backend user profile (HTTP ${status}).`);
    this.name = 'BackendUserRequestError';
  }
}

export class InvalidBackendUserProfileError extends Error {
  constructor() {
    super('The backend returned an invalid user profile.');
    this.name = 'InvalidBackendUserProfileError';
  }
}

type AuthenticatedFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export class GetCurrentUserUseCase {
  constructor(private readonly authenticatedFetch: AuthenticatedFetch) {}

  async execute(status: AuthStatus, signal?: AbortSignal) {
    if (status !== 'authenticated') return null;

    const response = await this.authenticatedFetch(
      `${BACKEND_URL}/api/v1/users/me`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal,
      },
    );

    if (response.status === 401) throw new BackendAuthenticationError();
    if (!response.ok) throw new BackendUserRequestError(response.status);

    const profile: unknown = await response.json();
    if (!isBackendUserProfile(profile)) {
      throw new InvalidBackendUserProfileError();
    }
    return profile;
  }
}

function isBackendUserProfile(value: unknown): value is BackendUserProfile {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string'
  );
}
