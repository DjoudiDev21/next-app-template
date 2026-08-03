import type { SignUpDto } from '../dtos/sign-up.dto';
import type { AuthRepository } from '../../domain/interfaces/auth.repository';

export class SignUpUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(input: SignUpDto): Promise<void> {
    return this.authRepository.signUpWithPassword(input);
  }
}
