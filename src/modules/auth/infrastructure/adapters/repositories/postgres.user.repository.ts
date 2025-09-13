import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../shared/config/database.config';
import { User } from '../../../domain/entities/user.entity';
import { Role } from '../../../domain/entities/role.entity';
import { IUserRepository } from '../../../domain/ports/repositories/iuser.repository';
import { UserEntity } from '../persistence/entities/user.entity';
import { RoleEntity } from '../persistence/entities/role.entity';

export class PostgresUserRepository implements IUserRepository {
  private userRepository: Repository<UserEntity>;
  private roleRepository: Repository<RoleEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
    this.roleRepository = AppDataSource.getRepository(RoleEntity);
  }

  async save(user: User): Promise<User> {
    const roleEntity = await this.roleRepository.findOne({
      where: { id: user.role.id }
    });

    if (!roleEntity) {
      throw new Error('Role not found');
    }

    const userEntity = this.userRepository.create({
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      roleId: user.role.id,
    });

    const savedUser = await this.userRepository.save(userEntity);
    return this.mapToDomain(savedUser, roleEntity);
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });

    if (!userEntity) {
      return null;
    }

    return this.mapToDomain(userEntity, userEntity.role);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!userEntity) {
      return null;
    }

    return this.mapToDomain(userEntity, userEntity.role);
  }

  async findAll(): Promise<User[]> {
    const userEntities = await this.userRepository.find({
      relations: ['role'],
    });

    return userEntities.map(userEntity => 
      this.mapToDomain(userEntity, userEntity.role)
    );
  }

  async update(user: User): Promise<User> {
    const roleEntity = await this.roleRepository.findOne({
      where: { id: user.role.id }
    });

    if (!roleEntity) {
      throw new Error('Role not found');
    }

    await this.userRepository.update(user.id, {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      roleId: user.role.id,
    });

    const updatedUserEntity = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['role'],
    });

    if (!updatedUserEntity) {
      throw new Error('User not found after update');
    }

    return this.mapToDomain(updatedUserEntity, updatedUserEntity.role);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email },
    });
    return count > 0;
  }

  private mapToDomain(userEntity: UserEntity, roleEntity: RoleEntity): User {
    const role = new Role(
      roleEntity.id,
      roleEntity.name,
      roleEntity.description,
      roleEntity.createdAt,
      roleEntity.updatedAt
    );

    return new User(
      userEntity.id,
      userEntity.email,
      userEntity.password,
      userEntity.firstName,
      userEntity.lastName,
      role,
      userEntity.isActive,
      userEntity.createdAt,
      userEntity.updatedAt
    );
  }
}
