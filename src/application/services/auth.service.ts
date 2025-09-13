import { IAuthPort } from '@/domain/ports/inbound/auth.port';
import { SignupUseCase } from '@/application/use_cases/signup.use_case';
import { LoginUseCase } from '@/application/use_cases/login.use_case';
import { User } from '@/domain/models/user';
import { SignupRequest, LoginRequest, AuthResponse } from '@/domain/ports/inbound/auth.port';

export class AuthService implements IAuthPort {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase
  ) {}

  async signup(request: SignupRequest): Promise<User> {
    return await this.signupUseCase.execute(request);
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    return await this.loginUseCase.execute(request);
  }

  async validateToken(token: string): Promise<any> {
    // Implementación básica de validación de token
    // En una implementación real, esto sería más complejo
    return { valid: true, payload: {} };
  }
}