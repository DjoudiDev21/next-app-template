import { afterEach, describe, expect, it, vi } from 'vitest';
import { AccessTokenUnavailableError } from '../../domain/entities/access-token.error';
import type { AccessTokenRepository } from '../../domain/interfaces/access-token.repository';
import { AuthenticatedFetchUseCase } from './authenticated-fetch.use-case';

describe('AuthenticatedFetchUseCase', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('does not send a request when Clerk returns no session token', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const useCase = new AuthenticatedFetchUseCase(tokens(null));

    await expect(
      useCase.execute('http://backend.test/protected'),
    ).rejects.toBeInstanceOf(AccessTokenUnavailableError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends the Clerk token as a Bearer token', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const useCase = new AuthenticatedFetchUseCase(tokens('clerk-jwt'));

    await useCase.execute('http://backend.test/protected');

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(new Headers(init.headers).get('Authorization')).toBe(
      'Bearer clerk-jwt',
    );
  });

  it('refreshes an expired token once after a 401', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const getAccessToken = vi
      .fn()
      .mockResolvedValueOnce('expired-jwt')
      .mockResolvedValueOnce('fresh-jwt');
    const useCase = new AuthenticatedFetchUseCase({ getAccessToken });

    await expect(
      useCase.execute('http://backend.test/protected'),
    ).resolves.toHaveProperty('status', 200);
    expect(getAccessToken).toHaveBeenNthCalledWith(2, { forceRefresh: true });
    const retryInit = fetchMock.mock.calls[1]?.[1] as RequestInit;
    expect(new Headers(retryInit.headers).get('Authorization')).toBe(
      'Bearer fresh-jwt',
    );
  });
});

function tokens(token: string | null): AccessTokenRepository {
  return { getAccessToken: vi.fn().mockResolvedValue(token) };
}
