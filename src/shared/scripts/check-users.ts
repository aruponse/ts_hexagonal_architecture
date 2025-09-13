import 'reflect-metadata';
import { AppDataSource } from '../config/database.config';
import { UserEntity } from '../../modules/auth/infrastructure/adapters/persistence/entities/user.entity';
import { RoleEntity } from '../../modules/auth/infrastructure/adapters/persistence/entities/role.entity';

async function checkUsers() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const userRepository = AppDataSource.getRepository(UserEntity);
    const roleRepository = AppDataSource.getRepository(RoleEntity);

    // Get all users with their roles
    const users = await userRepository.find({
      relations: ['role'],
    });

    console.log('\n📋 Users in database:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName}) - Role: ${user.role.name}`);
    });

    // Get all roles
    const roles = await roleRepository.find();
    console.log('\n🔑 Available roles:');
    roles.forEach(role => {
      console.log(`- ${role.name}: ${role.description}`);
    });

  } catch (error) {
    console.error('❌ Failed to check users:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

checkUsers();

