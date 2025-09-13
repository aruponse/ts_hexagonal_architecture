import { AuthService } from '@/application/services/auth.service';
import { UserService } from '@/application/services/user.service';
import { SignupUseCase } from '@/application/use_cases/signup.use_case';
import { LoginUseCase } from '@/application/use_cases/login.use_case';
import { GetProfileUseCase } from '@/application/use_cases/get_profile.use_case';
import { GetUsersUseCase } from '@/application/use_cases/get_users.use_case';
import { IUserRepository } from '@/domain/ports/outbound/user.repository.port';
import { IRoleRepository } from '@/domain/ports/outbound/role.repository.port';
import { IPasswordService } from '@/domain/ports/outbound/password.service.port';
import { ITokenService } from '@/domain/ports/outbound/token.service.port';

// Implementaciones de repositorios
import { PostgresUserRepository } from '@/adapters/outbound/persistence/typeorm/repositories/postgres.user.repository';
import { PostgresRoleRepository } from '@/adapters/outbound/persistence/typeorm/repositories/postgres.role.repository';

// Implementaciones de servicios
import { BcryptPasswordService } from '@/adapters/outbound/security/bcrypt.password.service';
import { JwtTokenService } from '@/adapters/outbound/security/jwt.token.service';

// Factories para crear las dependencias
export class RepositoryFactory {
  static createUserRepository(): IUserRepository {
    return new PostgresUserRepository();
  }

  static createRoleRepository(): IRoleRepository {
    return new PostgresRoleRepository();
  }
}

export class ServiceFactory {
  static createPasswordService(): IPasswordService {
    return new BcryptPasswordService();
  }

  static createTokenService(): ITokenService {
    // Lazy loading para evitar problemas con variables de entorno
    return new JwtTokenService();
  }
}

// Clase principal de dependencias
export class AuthDependencies {
  private static authService: AuthService;
  private static userService: UserService;

  static getAuthService(): AuthService {
    if (!this.authService) {
      const userRepository = RepositoryFactory.createUserRepository();
      const roleRepository = RepositoryFactory.createRoleRepository();
      const passwordService = ServiceFactory.createPasswordService();
      const tokenService = ServiceFactory.createTokenService();

      const signupUseCase = new SignupUseCase(userRepository, roleRepository, passwordService);
      const loginUseCase = new LoginUseCase(userRepository, passwordService, tokenService);

      this.authService = new AuthService(signupUseCase, loginUseCase);
    }
    return this.authService;
  }

  static getUserService(): UserService {
    if (!this.userService) {
      const userRepository = RepositoryFactory.createUserRepository();
      
      const getProfileUseCase = new GetProfileUseCase(userRepository);
      const getUsersUseCase = new GetUsersUseCase(userRepository);

      this.userService = new UserService(getProfileUseCase, getUsersUseCase);
    }
    return this.userService;
  }
}
