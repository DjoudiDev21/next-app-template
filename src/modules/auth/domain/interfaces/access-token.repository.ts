export interface AccessTokenRepository {
  getAccessToken(options?: { forceRefresh?: boolean }): Promise<string | null>;
}
