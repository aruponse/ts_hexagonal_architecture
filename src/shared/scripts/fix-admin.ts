import 'reflect-metadata';
import { AppDataSource } from '../config/database.config';

async function fixAdmin() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Get admin role ID
    const adminRoleResult = await AppDataSource.query(
      'SELECT id FROM roles WHERE name = ?',
      ['admin']
    );

    if (adminRoleResult.length === 0) {
      console.log('❌ Admin role not found');
      return;
    }

    const adminRoleId = adminRoleResult[0].id;
    console.log('Admin role ID:', adminRoleId);

    // Update superadmin user
    const result = await AppDataSource.query(
      'UPDATE users SET "roleId" = ? WHERE email = ?',
      [adminRoleId, 'superadmin@example.com']
    );

    console.log('✅ Updated superadmin role');

    // Verify the change
    const userResult = await AppDataSource.query(
      'SELECT u.email, r.name as role_name FROM users u JOIN roles r ON u."roleId" = r.id WHERE u.email = ?',
      ['superadmin@example.com']
    );

    console.log('Verification:', userResult[0]);

  } catch (error) {
    console.error('❌ Failed to fix admin:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

fixAdmin();

