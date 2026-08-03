import type { AuthRepository } from '../../domain/interfaces/auth.repository';

export class ResetSignUpUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.resetSignUp();
  }
}
