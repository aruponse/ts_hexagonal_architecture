import { type MigrationInterface, type QueryRunner } from "typeorm";

export class InitialRoles1700000000002 implements MigrationInterface {
  name = 'InitialRoles1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('📊 Insertando roles iniciales...');

    // Verificar si ya existen roles
    const existingRoles = await queryRunner.query(`SELECT COUNT(*) as count FROM roles`);
    const count = parseInt(existingRoles[0]?.count || '0');

    if (count > 0) {
      console.log('⚠️  Roles ya existen, saltando inserción');
      return;
    }

    // Detectar tipo de base de datos
    const isPostgres = queryRunner.connection.driver.options.type === 'postgres';
    const isSqlite = queryRunner.connection.driver.options.type === 'sqlite';

    if (isPostgres) {
      // PostgreSQL - usar uuid_generate_v4()
      await queryRunner.query(`
        INSERT INTO "roles" ("id", "name", "description", "createdAt", "updatedAt") 
        VALUES 
          (uuid_generate_v4(), $1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          (uuid_generate_v4(), $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        'admin',
        'Administrator role with full access',
        'user', 
        'Standard user role with limited access'
      ]);
    } else if (isSqlite) {
      // SQLite - usar UUIDs fijos
      await queryRunner.query(`
        INSERT INTO "roles" ("id", "name", "description", "createdAt", "updatedAt") 
        VALUES 
          ('admin-role-id', $1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
          ('user-role-id', $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [
        'admin',
        'Administrator role with full access',
        'user', 
        'Standard user role with limited access'
      ]);
    }

    console.log('✅ Roles iniciales insertados exitosamente');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🔄 Eliminando roles iniciales...');

    // Eliminar solo los roles por defecto
    await queryRunner.query(`DELETE FROM "roles" WHERE "name" IN ($1, $2)`, ['admin', 'user']);

    console.log('✅ Roles iniciales eliminados');
  }
}
