import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/ports/repositories/iuser.repository';

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(requestingUserId: string): Promise<User[]> {
    // Verificar que el usuario que hace la petición existe y está activo
    const requestingUser = await this.userRepository.findById(requestingUserId);
    if (!requestingUser) {
      throw new Error('Requesting user not found');
    }

    if (!requestingUser.isActive) {
      throw new Error('Requesting user account is deactivated');
    }

    // Verificar que el usuario tiene permisos para ver la lista de usuarios
    if (!requestingUser.canAccessUsers()) {
      throw new Error('Insufficient permissions to access users list');
    }

    // Obtener todos los usuarios
    return await this.userRepository.findAll();
  }
}
