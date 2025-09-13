import { IUserPort } from '@/domain/ports/inbound/user.port';
import { GetProfileUseCase } from '@/application/use_cases/get_profile.use_case';
import { GetUsersUseCase } from '@/application/use_cases/get_users.use_case';
import { User } from '@/domain/models/user';

export class UserService implements IUserPort {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly getUsersUseCase: GetUsersUseCase
  ) {}

  async getProfile(userId: string): Promise<User> {
    return await this.getProfileUseCase.execute(userId);
  }

  async getUsers(requestingUserId: string): Promise<User[]> {
    return await this.getUsersUseCase.execute(requestingUserId);
  }

  async updateProfile(userId: string, firstName: string, lastName: string): Promise<User> {
    // Implementación básica - en una implementación real sería más compleja
    const user = await this.getProfile(userId);
    return user.updateProfile(firstName, lastName);
  }
}