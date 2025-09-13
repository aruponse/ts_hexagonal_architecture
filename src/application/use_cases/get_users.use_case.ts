import { User } from '@/domain/models/user';
import { IUserRepository } from '@/domain/ports/outbound/user.repository.port';
import { UserNotFoundException, UserDeactivatedException, InsufficientPermissionsException } from '@/domain/exceptions/domain.exception';

export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(requestingUserId: string): Promise<User[]> {
    // Verificar que el usuario que hace la petición existe y está activo
    const requestingUser = await this.userRepository.findById(requestingUserId);
    if (!requestingUser) {
      throw new UserNotFoundException(requestingUserId);
    }

    if (!requestingUser.isActive) {
      throw new UserDeactivatedException();
    }

    // Verificar que el usuario tiene permisos para ver la lista de usuarios
    if (!requestingUser.canAccessUsers()) {
      throw new InsufficientPermissionsException('access users list');
    }

    // Obtener todos los usuarios
    return await this.userRepository.findAll();
  }
}

