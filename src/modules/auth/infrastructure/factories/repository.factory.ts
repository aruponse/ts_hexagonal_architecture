import { PostgresUserRepository } from '../adapters/repositories/postgres.user.repository';
import { PostgresRoleRepository } from '../adapters/repositories/postgres.role.repository';
import { IUserRepository } from '../../domain/ports/repositories/iuser.repository';
import { IRoleRepository } from '../../domain/ports/repositories/irole.repository';

export class RepositoryFactory {
  private static userRepository: IUserRepository;
  private static roleRepository: IRoleRepository;

  static getUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new PostgresUserRepository();
    }
    return this.userRepository;
  }

  static getRoleRepository(): IRoleRepository {
    if (!this.roleRepository) {
      this.roleRepository = new PostgresRoleRepository();
    }
    return this.roleRepository;
  }
}

