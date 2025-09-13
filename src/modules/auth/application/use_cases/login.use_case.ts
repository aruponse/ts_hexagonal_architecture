import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/ports/repositories/iuser.repository';
import { IPasswordService } from '../../domain/ports/services/ipassword.service';
import { ITokenService } from '../../domain/ports/services/itoken.service';
import { LoginRequest, AuthResponse } from '../../domain/types/auth.type';

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
      throw new Error('Invalid credentials');
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new Error('User account is deactivated');
    }

    // Verificar la contraseña
    const isPasswordValid = await this.passwordService.compare(
      request.password,
      user.password
    );
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
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
