export class AccessTokenUnavailableError extends Error {
  constructor() {
    super('Clerk did not provide an access token for the current session.');
    this.name = 'AccessTokenUnavailableError';
  }
}
