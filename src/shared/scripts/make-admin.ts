import 'reflect-metadata';
import { AppDataSource } from '../config/database.config';
import { UserEntity } from '../../modules/auth/infrastructure/adapters/persistence/entities/user.entity';
import { RoleEntity } from '../../modules/auth/infrastructure/adapters/persistence/entities/role.entity';

async function makeUserAdmin(email: string) {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    const userRepository = AppDataSource.getRepository(UserEntity);
    const roleRepository = AppDataSource.getRepository(RoleEntity);

    // Find user by email
    const user = await userRepository.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      return;
    }

    // Find admin role
    const adminRole = await roleRepository.findOne({
      where: { name: 'admin' },
    });

    if (!adminRole) {
      console.log('❌ Admin role not found');
      return;
    }

    // Update user role
    user.roleId = adminRole.id;
    await userRepository.save(user);

    console.log(`✅ User ${email} is now an admin`);

  } catch (error) {
    console.error('❌ Failed to make user admin:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log('Usage: bun run src/shared/scripts/make-admin.ts <email>');
  process.exit(1);
}

makeUserAdmin(email);

