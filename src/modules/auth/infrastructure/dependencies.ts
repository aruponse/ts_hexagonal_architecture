import { AuthService } from '../application/services/auth.service';
import { SignupUseCase } from '../application/use_cases/signup.use_case';
import { LoginUseCase } from '../application/use_cases/login.use_case';
import { GetProfileUseCase } from '../application/use_cases/get_profile.use_case';
import { GetUsersUseCase } from '../application/use_cases/get_users.use_case';
import { RepositoryFactory } from './factories/repository.factory';
import { ServiceFactory } from './factories/service.factory';

export class AuthDependencies {
  private static authService: AuthService;

  static getAuthService(): AuthService {
    if (!this.authService) {
      const userRepository = RepositoryFactory.getUserRepository();
      const roleRepository = RepositoryFactory.getRoleRepository();
      const passwordService = ServiceFactory.getPasswordService();
      const tokenService = ServiceFactory.getTokenService();

      const signupUseCase = new SignupUseCase(
        userRepository,
        roleRepository,
        passwordService
      );

      const loginUseCase = new LoginUseCase(
        userRepository,
        passwordService,
        tokenService
      );

      const getProfileUseCase = new GetProfileUseCase(userRepository);
      const getUsersUseCase = new GetUsersUseCase(userRepository);

      this.authService = new AuthService(
        signupUseCase,
        loginUseCase,
        getProfileUseCase,
        getUsersUseCase
      );
    }

    return this.authService;
  }
}
