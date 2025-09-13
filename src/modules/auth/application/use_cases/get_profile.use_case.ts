import { User } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/ports/repositories/iuser.repository';

export class GetProfileUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('User account is deactivated');
    }

    return user;
  }
}

