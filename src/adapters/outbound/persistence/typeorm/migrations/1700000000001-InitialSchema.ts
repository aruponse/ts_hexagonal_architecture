import { type MigrationInterface, type QueryRunner, Table, TableIndex, TableForeignKey } from "typeorm";

export class InitialSchema1700000000001 implements MigrationInterface {
  name = 'InitialSchema1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    console.log('🗄️ Creando esquema inicial...');

    // Crear tabla de roles
    await queryRunner.createTable(
      new Table({
        name: "roles",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "name",
            type: "varchar",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    // Crear tabla de usuarios
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "password",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "firstName",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "lastName",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "isActive",
            type: "boolean",
            default: true,
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "roleId",
            type: "uuid",
            isNullable: false,
          },
        ],
      })
    );

    // Crear foreign key para users -> roles
    await queryRunner.createForeignKey(
      "users",
      new TableForeignKey({
        columnNames: ["roleId"],
        referencedTableName: "roles",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );

    // Crear índices
    await queryRunner.createIndex(
      "roles",
      new TableIndex({
        name: "idx_roles_name",
        columnNames: ["name"],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "idx_users_email",
        columnNames: ["email"],
        isUnique: true,
      })
    );

    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "idx_users_role_id",
        columnNames: ["roleId"],
      })
    );

    console.log('✅ Esquema inicial creado exitosamente');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('🔄 Revirtiendo esquema inicial...');

    // Eliminar índices
    await queryRunner.dropIndex("users", "idx_users_role_id");
    await queryRunner.dropIndex("users", "idx_users_email");
    await queryRunner.dropIndex("roles", "idx_roles_name");

    // Eliminar foreign keys
    const usersTable = await queryRunner.getTable("users");
    if (usersTable) {
      const foreignKey = usersTable.foreignKeys.find(
        fk => fk.columnNames.indexOf("roleId") !== -1
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey("users", foreignKey);
      }
    }

    // Eliminar tablas (en orden correcto por foreign keys)
    await queryRunner.dropTable("users");
    await queryRunner.dropTable("roles");

    console.log('✅ Esquema inicial revertido exitosamente');
  }
}
