import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppDataSource } from '../../src/shared/config/database.config';
import { RoleEntity } from '../../src/modules/auth/infrastructure/adapters/persistence/entities/role.entity';
import authRouter from '../../src/modules/auth/infrastructure/adapters/http/routes/router';
import publicRouter from '../../src/modules/auth/infrastructure/adapters/http/routes/public.router';

// Create test app without database initialization
const createTestApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({ origin: '*', credentials: true }));

  // Rate limiting
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  }));

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api', authRouter);
  app.use('/api/public', publicRouter);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong',
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      error: 'Not found',
      message: `Route ${req.originalUrl} not found`,
    });
  });

  return app;
};

describe('Auth E2E Tests', () => {
  let app: any;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Set test environment
    process.env.NODE_ENV = 'test';
    process.env.USE_SQLITE = 'true';
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRES_IN = '1h';
    
    app = createTestApp();
    
    // Initialize test database
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    // Create test roles if they don't exist
    const roleRepository = AppDataSource.getRepository(RoleEntity);
    
    let adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      adminRole = roleRepository.create({
        name: 'admin',
        description: 'Administrator role',
      });
      await roleRepository.save(adminRole);
    }
    
    let userRole = await roleRepository.findOne({ where: { name: 'user' } });
    if (!userRole) {
      userRole = roleRepository.create({
        name: 'user',
        description: 'User role',
      });
      await roleRepository.save(userRole);
    }
  });

  afterAll(async () => {
    await AppDataSource.destroy();
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

  describe('Authentication Flow', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'testuser@example.com',
        password: 'TestPass123!',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.firstName).toBe(userData.firstName);
      expect(response.body.user.lastName).toBe(userData.lastName);
      expect(response.body.user.role.name).toBe('user');
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'TestPass123!',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user.role).toBe('user');

      userToken = response.body.token;
    });

    it('should reject login with invalid credentials', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'WrongPassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.email).toBe('testuser@example.com');
      expect(response.body.firstName).toBe('Test');
      expect(response.body.lastName).toBe('User');
      expect(response.body.role.name).toBe('user');
    });

    it('should reject profile access without token', async () => {
      const response = await request(app)
        .get('/api/auth/profile')
        .expect(401);

      expect(response.body.error).toBe('No token provided');
    });
  });

  describe('User Management', () => {
    beforeAll(async () => {
      // Create admin user for testing
      const adminData = {
        email: 'admin@example.com',
        password: 'AdminPass123!',
        firstName: 'Admin',
        lastName: 'User',
      };

      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(adminData);

      // Make user admin
      const { UserEntity } = await import('../../src/modules/auth/infrastructure/adapters/persistence/entities/user.entity');
      const userRepository = AppDataSource.getRepository(UserEntity);
      const roleRepository = AppDataSource.getRepository(RoleEntity);
      const adminRole = await roleRepository.findOne({ where: { name: 'admin' } });
      const user = await userRepository.findOne({ where: { email: 'admin@example.com' } });
      
      if (user && adminRole) {
        user.roleId = adminRole.id;
        await userRepository.save(user);
      }

      // Login as admin
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'AdminPass123!',
        });

      adminToken = loginResponse.body.token;
    });

    it('should get users list as admin', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.users).toBeDefined();
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.count).toBeDefined();
    });

    it('should reject users list access as regular user', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.error).toBe('Insufficient permissions to access users list');
    });

    it('should reject users list access without token', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(401);

      expect(response.body.error).toBe('No token provided');
    });
  });

  describe('Validation', () => {
    it('should validate signup request', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123',
        firstName: 'A',
        lastName: 'B',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toBeDefined();
      expect(Array.isArray(response.body.details)).toBe(true);
    });

    it('should validate login request', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);

      expect(response.body.error).toBe('Not found');
    });

    it('should handle duplicate email registration', async () => {
      const userData = {
        email: 'testuser@example.com', // Already exists
        password: 'TestPass123!',
        firstName: 'Another',
        lastName: 'User',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('User with this email already exists');
    });
  });
});

