import { SignupUseCase } from '../use_cases/signup.use_case';
import { LoginUseCase } from '../use_cases/login.use_case';
import { GetProfileUseCase } from '../use_cases/get_profile.use_case';
import { GetUsersUseCase } from '../use_cases/get_users.use_case';
import { User } from '../../domain/entities/user.entity';
import { SignupRequest, LoginRequest, AuthResponse } from '../../domain/types/auth.type';

export class AuthService {
  constructor(
    private readonly signupUseCase: SignupUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly getUsersUseCase: GetUsersUseCase
  ) {}

  async signup(request: SignupRequest): Promise<User> {
    return await this.signupUseCase.execute(request);
  }

  async login(request: LoginRequest): Promise<AuthResponse> {
    return await this.loginUseCase.execute(request);
  }

  async getProfile(userId: string): Promise<User> {
    return await this.getProfileUseCase.execute(userId);
  }

  async getUsers(requestingUserId: string): Promise<User[]> {
    return await this.getUsersUseCase.execute(requestingUserId);
  }
}

