import type { SignUpDto } from '../../application/dtos/sign-up.dto';
import type { AuthIdentity } from '../entities/auth-identity.entity';
import type { AuthStatus } from '../entities/auth-session.entity';
import type { BackendProfileState } from '../entities/backend-user-profile.entity';
import type { AccessTokenRepository } from './access-token.repository';

export interface AuthRepository extends AccessTokenRepository {
  status: AuthStatus;
  identity: AuthIdentity | null;
  backendProfile: BackendProfileState;
  retryBackendProfile(): void;
  signInWithPassword(email: string, password: string): Promise<void>;
  signUpWithPassword(input: SignUpDto): Promise<void>;
  verifySignUpEmail(code: string): Promise<void>;
  resetSignUp(): Promise<void>;
  signOut(): Promise<void>;
}
