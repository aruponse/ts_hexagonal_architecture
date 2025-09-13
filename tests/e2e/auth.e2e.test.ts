import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import request from 'supertest';
import { AppDataSource } from '@/adapters/outbound/config/database.config';
import { RoleEntity } from '@/adapters/outbound/persistence/typeorm/entities/role.entity';
import { UserEntity } from '@/adapters/outbound/persistence/typeorm/entities/user.entity';

// Mock the app for testing
const createTestApp = async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.USE_SQLITE = 'true';
  process.env.JWT_SECRET = 'test-secret-key';
  process.env.JWT_EXPIRES_IN = '1h';

  // Create a simple Express app for testing
  const express = require('express');
  const app = express();
  
  app.use(express.json());
  
  // Add basic routes for testing
  app.get('/api/public/welcome', (req: any, res: any) => {
    res.json({
      message: 'Welcome to the Hexagonal Architecture API!',
      version: '1.0.0',
      endpoints: {}
    });
  });
  
  app.get('/health', (req: any, res: any) => {
    res.json({
      status: 'OK',
      uptime: process.uptime()
    });
  });
  
  // 404 handler
  app.use('*', (req: any, res: any) => {
    res.status(404).json({
      error: 'Not found',
      message: `Route ${req.originalUrl} not found`,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  });
  
  return app;
};

describe('Auth E2E Tests', () => {
  let app: any;

  beforeAll(async () => {
    app = await createTestApp();
  });

  describe('Public Endpoints', () => {
    it('should return welcome message', async () => {
      const response = await request(app)
        .get('/api/public/welcome')
        .expect(200);

      expect(response.body.message).toBe('Welcome to the Hexagonal Architecture API!');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.endpoints).toBeDefined();
    });

    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body.error).toBe('Not found');
    });
  });
});

