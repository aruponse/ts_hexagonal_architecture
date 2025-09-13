import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla de roles
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" varchar PRIMARY KEY NOT NULL,
        "name" varchar NOT NULL,
        "description" varchar NOT NULL,
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now'))
      )
    `);

    // Crear tabla de usuarios
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" varchar PRIMARY KEY NOT NULL,
        "email" varchar NOT NULL,
        "password" varchar NOT NULL,
        "firstName" varchar NOT NULL,
        "lastName" varchar NOT NULL,
        "isActive" boolean NOT NULL DEFAULT (1),
        "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
        "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
        "roleId" varchar NOT NULL,
        FOREIGN KEY ("roleId") REFERENCES "roles" ("id")
      )
    `);

    // Crear índices únicos
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_roles_name" ON "roles" ("name")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email")`);

    // Insertar roles por defecto
    await queryRunner.query(`
      INSERT INTO "roles" ("id", "name", "description", "createdAt", "updatedAt") 
      VALUES 
        ('admin-role-id', 'admin', 'Administrator role with full access', datetime('now'), datetime('now')),
        ('user-role-id', 'user', 'Standard user role with limited access', datetime('now'), datetime('now'))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP INDEX "IDX_roles_name"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
