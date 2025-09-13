import { DataSource } from 'typeorm';
import { UserEntity } from '../../modules/auth/infrastructure/adapters/persistence/entities/user.entity';
import { RoleEntity } from '../../modules/auth/infrastructure/adapters/persistence/entities/role.entity';

// Use SQLite for development if PostgreSQL is not available
const isDevelopment = process.env.NODE_ENV === 'development';
const useSQLite = process.env.USE_SQLITE === 'true' || isDevelopment;

export const databaseConfig = useSQLite ? {
  type: 'sqlite' as const,
  database: 'database.sqlite',
  entities: [UserEntity, RoleEntity],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: true,
  logging: isDevelopment,
} : {
  type: 'postgres' as const,
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  username: process.env.PG_USERNAME || 'postgres',
  password: process.env.PG_PASSWORD || 'password',
  database: process.env.PG_DATABASE || 'hexagonal_api',
  entities: [UserEntity, RoleEntity],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};

export const AppDataSource = new DataSource(databaseConfig);