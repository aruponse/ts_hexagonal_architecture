// Load environment variables first
import dotenv from 'dotenv';
import path from 'path';

const envPath = path.resolve(process.cwd(), 'env.local');
dotenv.config({ path: envPath });

export {};
