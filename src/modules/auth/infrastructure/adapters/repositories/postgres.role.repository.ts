import { Repository } from 'typeorm';
import { AppDataSource } from '../../../../../shared/config/database.config';
import { Role } from '../../../domain/entities/role.entity';
import { IRoleRepository } from '../../../domain/ports/repositories/irole.repository';
import { RoleEntity } from '../persistence/entities/role.entity';

export class PostgresRoleRepository implements IRoleRepository {
  private roleRepository: Repository<RoleEntity>;

  constructor() {
    this.roleRepository = AppDataSource.getRepository(RoleEntity);
  }

  async save(role: Role): Promise<Role> {
    const roleEntity = this.roleRepository.create({
      name: role.name,
      description: role.description,
    });

    const savedRole = await this.roleRepository.save(roleEntity);
    return this.mapToDomain(savedRole);
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
    return roleEntities.map(roleEntity => this.mapToDomain(roleEntity));
  }

  async update(role: Role): Promise<Role> {
    await this.roleRepository.update(role.id, {
      name: role.name,
      description: role.description,
    });

    const updatedRoleEntity = await this.roleRepository.findOne({
      where: { id: role.id },
    });

    if (!updatedRoleEntity) {
      throw new Error('Role not found after update');
    }

    return this.mapToDomain(updatedRoleEntity);
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
