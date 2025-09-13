import { DataSource } from 'typeorm';
import { UserEntity } from '../persistence/typeorm/entities/user.entity';
import { RoleEntity } from '../persistence/typeorm/entities/role.entity';

// Use SQLite for development if PostgreSQL is not available
const isDevelopment = process.env.NODE_ENV === 'development';
const useSQLite = process.env.USE_SQLITE === 'true' || isDevelopment;

export const databaseConfig = useSQLite ? {
  type: 'sqlite' as const,
  database: 'database.sqlite',
  entities: [UserEntity, RoleEntity],
  migrations: [__dirname + '/../persistence/typeorm/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: isDevelopment,
} : {
  type: 'postgres' as const,
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  username: process.env.PG_USERNAME || 'postgres',
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE || 'hexagonal_api',
  entities: [UserEntity, RoleEntity],
  migrations: [__dirname + '/../persistence/typeorm/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};

export const AppDataSource = new DataSource(databaseConfig);