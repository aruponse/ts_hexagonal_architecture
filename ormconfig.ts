import { DataSource } from 'typeorm';
import { databaseConfig } from './src/adapters/outbound/config/database.config';

export default new DataSource(databaseConfig);

