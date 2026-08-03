export interface AuthSession {
  identityId: string;
}

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';
