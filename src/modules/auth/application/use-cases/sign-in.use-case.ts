import type { SignInDto } from '../dtos/sign-in.dto';
import type { AuthRepository } from '../../domain/interfaces/auth.repository';

export class SignInUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(input: SignInDto): Promise<void> {
    return this.authRepository.signInWithPassword(input.email, input.password);
  }
}
