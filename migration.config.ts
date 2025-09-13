import { DataSource } from 'typeorm';
import { UserEntity } from './src/adapters/outbound/persistence/typeorm/entities/user.entity';
import { RoleEntity } from './src/adapters/outbound/persistence/typeorm/entities/role.entity';

function getDatabaseConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Configuración por ambiente
  switch (nodeEnv) {
    case 'development':
      // Dev: SQLite por defecto, configurable con USE_SQLITE=false para PostgreSQL
      const useSQLiteDev = process.env.USE_SQLITE !== 'false';
      return useSQLiteDev ? getSQLiteConfig() : getPostgresConfig();
      
    case 'test':
      // Test: SQLite por defecto, configurable con USE_POSTGRES=true para PostgreSQL
      const usePostgresTest = process.env.USE_POSTGRES === 'true';
      return usePostgresTest ? getPostgresTestConfig() : getSQLiteConfig();
      
    case 'staging':
      // Staging: PostgreSQL por defecto, configurable con USE_SQLITE=true para SQLite
      const useSQLiteStaging = process.env.USE_SQLITE === 'true';
      return useSQLiteStaging ? getSQLiteConfig() : getPostgresConfig();
      
    case 'production':
      // Production: Solo PostgreSQL, no permite SQLite
      return getPostgresConfig();
      
    default:
      return getSQLiteConfig();
  }
}

function getSQLiteConfig() {
  return {
    type: 'sqlite' as const,
    database: 'database.sqlite',
    entities: [UserEntity, RoleEntity],
    migrations: [__dirname + '/src/adapters/outbound/persistence/typeorm/migrations/*{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  };
}

function getPostgresConfig() {
  return {
    type: 'postgres' as const,
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432'),
    username: process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE || 'hexagonal_api',
    entities: [UserEntity, RoleEntity],
    migrations: [__dirname + '/src/adapters/outbound/persistence/typeorm/migrations/*{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  };
}

function getPostgresTestConfig() {
  return {
    type: 'postgres' as const,
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5432'),
    username: process.env.PG_USERNAME || 'postgres',
    password: process.env.PG_PASSWORD,
    database: process.env.PG_TEST_DATABASE || 'hexagonal_api_test',
    entities: [UserEntity, RoleEntity],
    migrations: [__dirname + '/src/adapters/outbound/persistence/typeorm/migrations/*{.ts,.js}'],
    synchronize: true, // Para tests
    logging: false, // Sin logging en tests
  };
}

export const databaseConfig = getDatabaseConfig();
export default new DataSource(databaseConfig);
