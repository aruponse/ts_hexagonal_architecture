import { User } from '../../domain/models/user';
import { IUserRepository } from '../../domain/ports/outbound/user.repository.port';
import { UserNotFoundException, UserDeactivatedException } from '../../domain/exceptions/domain.exception';

export class GetProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException(userId);
    }

    if (!user.isActive) {
      throw new UserDeactivatedException();
    }

    return user;
  }
}

