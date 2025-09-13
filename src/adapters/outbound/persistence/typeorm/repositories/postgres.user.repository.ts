import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database.config';
import { UserEntity } from '../entities/user.entity';
import { RoleEntity } from '../entities/role.entity';
import { User } from '../../../../../domain/models/user';
import { Role } from '../../../../../domain/models/role';
import { IUserRepository } from '../../../../../domain/ports/outbound/user.repository.port';

export class PostgresUserRepository implements IUserRepository {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  async save(user: User): Promise<User> {
    const roleEntity = await AppDataSource.getRepository(RoleEntity).findOne({
      where: { id: user.role.id }
    });

    if (!roleEntity) {
      throw new Error('Role not found');
    }

    const userEntity = this.userRepository.create({
      id: user.id || undefined,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roleId: user.role.id,
    });

    const savedEntity = await this.userRepository.save(userEntity);
    return this.mapToDomain(savedEntity, roleEntity);
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

    return userEntities.map(entity => this.mapToDomain(entity, entity.role));
  }

  async update(user: User): Promise<User> {
    const roleEntity = await AppDataSource.getRepository(RoleEntity).findOne({
      where: { id: user.role.id }
    });

    if (!roleEntity) {
      throw new Error('Role not found');
    }

    const userEntity = this.userRepository.create({
      id: user.id,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: new Date(),
      roleId: user.role.id,
    });

    const savedEntity = await this.userRepository.save(userEntity);
    return this.mapToDomain(savedEntity, roleEntity);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { email } });
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