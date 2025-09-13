import { DataSource } from 'typeorm';
import { databaseConfig } from './src/shared/config/database.config';

export default new DataSource(databaseConfig);
