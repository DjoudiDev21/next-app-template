import type { AccessTokenRepository } from "../../domain/interfaces/access-token.repository";

/**
 * Adds the current access token to API requests and retries once with a
 * refreshed token when the backend rejects an expired token.
 */
export class AuthenticatedFetchUseCase {
  constructor(private readonly tokens: AccessTokenRepository) {}

  async execute(input: RequestInfo | URL, init: RequestInit = {}) {
    const response = await this.send(input, init, false);

    if (response.status !== 401) {
      return response;
    }

    return this.send(input, init, true);
  }

  private async send(
    input: RequestInfo | URL,
    init: RequestInit,
    forceRefresh: boolean,
  ) {
    const token = await this.tokens.getAccessToken({ forceRefresh });
    const headers = new Headers(init.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      headers.delete("Authorization");
    }

    return fetch(input, { ...init, headers });
  }
}
