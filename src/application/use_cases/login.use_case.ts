import { User } from '@/domain/models/user';
import { IUserRepository } from '@/domain/ports/outbound/user.repository.port';
import { IPasswordService } from '@/domain/ports/outbound/password.service.port';
import { ITokenService } from '@/domain/ports/outbound/token.service.port';
import { LoginRequest, AuthResponse } from '@/domain/ports/inbound/auth.port';
import { UserNotFoundException, InvalidCredentialsException, UserDeactivatedException } from '@/domain/exceptions/domain.exception';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(request: LoginRequest): Promise<AuthResponse> {
    // Buscar el usuario por email
    const user = await this.userRepository.findByEmail(request.email);
    if (!user) {
      throw new InvalidCredentialsException();
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new UserDeactivatedException();
    }

    // Verificar la contraseña
    const isPasswordValid = await this.passwordService.compare(
      request.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    // Generar token JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role.name,
    };

    const token = this.tokenService.generate(tokenPayload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
      },
    };
  }
}

