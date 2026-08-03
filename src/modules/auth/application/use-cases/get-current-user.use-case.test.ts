import { describe, expect, it, vi } from 'vitest';
import {
  BackendAuthenticationError,
  GetCurrentUserUseCase,
} from './get-current-user.use-case';

describe('GetCurrentUserUseCase', () => {
  it.each(['loading', 'anonymous'] as const)(
    'does not call the backend while auth status is %s',
    async (status) => {
      const authenticatedFetch = vi.fn();
      const useCase = new GetCurrentUserUseCase(authenticatedFetch);

      await expect(useCase.execute(status)).resolves.toBeNull();
      expect(authenticatedFetch).not.toHaveBeenCalled();
    },
  );

  it('requests /api/v1/users/me after authentication and returns its profile', async () => {
    const profile = { id: 'local-user-id', email: 'user@example.com' };
    const authenticatedFetch = vi
      .fn()
      .mockResolvedValue(Response.json(profile));
    const useCase = new GetCurrentUserUseCase(authenticatedFetch);

    await expect(useCase.execute('authenticated')).resolves.toEqual(profile);
    expect(authenticatedFetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/v1/users/me',
      expect.objectContaining({
        method: 'GET',
        headers: { Accept: 'application/json' },
      }),
    );
  });

  it('turns a final 401 response into an authentication error', async () => {
    const authenticatedFetch = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 401 }));
    const useCase = new GetCurrentUserUseCase(authenticatedFetch);

    await expect(useCase.execute('authenticated')).rejects.toBeInstanceOf(
      BackendAuthenticationError,
    );
  });
});
