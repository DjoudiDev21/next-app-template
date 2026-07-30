import type { AuthRepository } from "../../domain/interfaces/auth.repository";

export class SignOutUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(): Promise<void> {
    return this.authRepository.signOut();
  }
}
