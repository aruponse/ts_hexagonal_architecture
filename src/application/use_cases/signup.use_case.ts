import { User } from '../../domain/models/user';
import { Role } from '../../domain/models/role';
import { IUserRepository } from '../../domain/ports/outbound/user.repository.port';
import { IRoleRepository } from '../../domain/ports/outbound/role.repository.port';
import { IPasswordService } from '../../domain/ports/outbound/password.service.port';
import { SignupRequest } from '../../domain/ports/inbound/auth.port';
import { UserAlreadyExistsException, RoleNotFoundException } from '../../domain/exceptions/domain.exception';

export class SignupUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly roleRepository: IRoleRepository,
    private readonly passwordService: IPasswordService
  ) {}

  async execute(request: SignupRequest): Promise<User> {
    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(request.email);
    }

    // Obtener el rol por defecto (user)
    const defaultRole = await this.roleRepository.findByName('user');
    if (!defaultRole) {
      throw new RoleNotFoundException('user');
    }

    // Cifrar la contraseña
    const hashedPassword = await this.passwordService.hash(request.password);

    // Crear el usuario
    const user = User.create(
      request.email,
      hashedPassword,
      request.firstName,
      request.lastName,
      defaultRole
    );

    // Guardar el usuario
    return await this.userRepository.save(user);
  }
}

