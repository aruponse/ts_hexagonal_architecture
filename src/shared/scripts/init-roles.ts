import 'reflect-metadata';
import { AppDataSource } from '../config/database.config';
import { RoleEntity } from '../../modules/auth/infrastructure/adapters/persistence/entities/role.entity';

async function initializeRoles() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const roleRepository = AppDataSource.getRepository(RoleEntity);

    // Check if roles already exist
    const existingRoles = await roleRepository.find();
    if (existingRoles.length > 0) {
      console.log('✅ Roles already exist');
      return;
    }

    // Create default roles
    const adminRole = roleRepository.create({
      name: 'admin',
      description: 'Administrator role with full access',
    });

    const userRole = roleRepository.create({
      name: 'user',
      description: 'Standard user role with limited access',
    });

    await roleRepository.save([adminRole, userRole]);
    console.log('✅ Default roles created successfully');

  } catch (error) {
    console.error('❌ Failed to initialize roles:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

initializeRoles();

