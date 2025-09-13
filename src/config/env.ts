// Load environment variables first
import dotenv from 'dotenv';
import path from 'path';

function loadEnvironmentConfig() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Determinar qué archivo de configuración cargar
  let envFile = 'env.local'; // Por defecto
  
  switch (nodeEnv) {
    case 'development':
      envFile = 'env.development';
      break;
    case 'test':
      envFile = 'env.test';
      break;
    case 'staging':
      envFile = 'env.staging';
      break;
    case 'production':
      envFile = 'env.production';
      break;
  }
  
  const envPath = path.resolve(process.cwd(), envFile);
  
  // Cargar configuración específica del ambiente
  dotenv.config({ path: envPath });
  
  // También cargar env.local si existe (para overrides locales)
  const localEnvPath = path.resolve(process.cwd(), 'env.local');
  dotenv.config({ path: localEnvPath, override: false });
  
  console.log(`🌍 Environment: ${nodeEnv}`);
  console.log(`📁 Config file: ${envFile}`);
}

loadEnvironmentConfig();

export {};
