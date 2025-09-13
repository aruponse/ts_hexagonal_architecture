import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialRoles1700000000000 implements MigrationInterface {
  name = 'InitialRoles1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO roles (id, name, description, "createdAt", "updatedAt") 
      VALUES 
        (gen_random_uuid(), 'admin', 'Administrator role with full access', NOW(), NOW()),
        (gen_random_uuid(), 'user', 'Standard user role with limited access', NOW(), NOW())
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM roles WHERE name IN ('admin', 'user')`);
  }
}
