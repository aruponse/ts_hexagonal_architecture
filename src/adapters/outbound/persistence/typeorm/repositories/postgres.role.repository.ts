import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/database.config';
import { RoleEntity } from '../entities/role.entity';
import { Role } from '../../../../../domain/models/role';
import { IRoleRepository } from '../../../../../domain/ports/outbound/role.repository.port';

export class PostgresRoleRepository implements IRoleRepository {
  private roleRepository: Repository<RoleEntity>;

  constructor() {
    this.roleRepository = AppDataSource.getRepository(RoleEntity);
  }

  async save(role: Role): Promise<Role> {
    const roleEntity = this.roleRepository.create({
      id: role.id || undefined,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    });

    const savedEntity = await this.roleRepository.save(roleEntity);
    return this.mapToDomain(savedEntity);
  }

  async findById(id: string): Promise<Role | null> {
    const roleEntity = await this.roleRepository.findOne({
      where: { id },
    });

    if (!roleEntity) {
      return null;
    }

    return this.mapToDomain(roleEntity);
  }

  async findByName(name: string): Promise<Role | null> {
    const roleEntity = await this.roleRepository.findOne({
      where: { name },
    });

    if (!roleEntity) {
      return null;
    }

    return this.mapToDomain(roleEntity);
  }

  async findAll(): Promise<Role[]> {
    const roleEntities = await this.roleRepository.find();
    return roleEntities.map(entity => this.mapToDomain(entity));
  }

  async update(role: Role): Promise<Role> {
    const roleEntity = this.roleRepository.create({
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: new Date(),
    });

    const savedEntity = await this.roleRepository.save(roleEntity);
    return this.mapToDomain(savedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.roleRepository.delete(id);
  }

  private mapToDomain(roleEntity: RoleEntity): Role {
    return new Role(
      roleEntity.id,
      roleEntity.name,
      roleEntity.description,
      roleEntity.createdAt,
      roleEntity.updatedAt
    );
  }
}