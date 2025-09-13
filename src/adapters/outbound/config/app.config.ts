export const appConfig = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  swagger: {
    enabled: shouldEnableSwagger(),
    path: '/api-docs',
  },
};

function shouldEnableSwagger(): boolean {
  const nodeEnv = process.env.NODE_ENV || 'development';
  
  // Swagger habilitado en: development, staging
  // Swagger deshabilitado en: test, production
  return ['development', 'staging'].includes(nodeEnv);
}

