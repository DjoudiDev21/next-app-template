import type { AuthSession } from '../entities/auth-session.entity';
import type { AccessTokenRepository } from './access-token.repository';

export interface ServerAuthRepository extends AccessTokenRepository {
  getSession(): Promise<AuthSession | null>;
  requireSession(): Promise<AuthSession>;
}
