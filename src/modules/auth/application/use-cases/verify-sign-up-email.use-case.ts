import type { AuthRepository } from "../../domain/interfaces/auth.repository";

export class VerifySignUpEmailUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(code: string): Promise<void> {
    return this.authRepository.verifySignUpEmail(code);
  }
}
