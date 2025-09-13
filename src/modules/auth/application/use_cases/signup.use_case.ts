import { User } from '../../domain/entities/user.entity';
import { Role } from '../../domain/entities/role.entity';
import { IUserRepository } from '../../domain/ports/repositories/iuser.repository';
import { IRoleRepository } from '../../domain/ports/repositories/irole.repository';
import { IPasswordService } from '../../domain/ports/services/ipassword.service';
import { SignupRequest } from '../../domain/types/auth.type';

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
      throw new Error('User with this email already exists');
    }

    // Obtener el rol por defecto (user)
    const defaultRole = await this.roleRepository.findByName('user');
    if (!defaultRole) {
      throw new Error('Default user role not found');
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
