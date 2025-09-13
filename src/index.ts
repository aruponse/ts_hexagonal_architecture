import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { AppDataSource } from './adapters/outbound/config/database.config';
import { appConfig } from './adapters/outbound/config/app.config';
import authRouter from './adapters/inbound/http/routes/index.routes';
import publicRouter from './adapters/inbound/http/routes/public.router';
import { errorMiddleware } from './adapters/inbound/http/middlewares/error.middleware';

// Load environment variables
dotenv.config({ path: './env.local' });

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(appConfig.cors));

// Rate limiting
app.use(rateLimit(appConfig.rateLimit));

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

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
});

// Error handling middleware (must be last)
app.use(errorMiddleware);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connection established');

    // Run migrations in production
    if (appConfig.nodeEnv === 'production') {
      await AppDataSource.runMigrations();
      console.log('✅ Migrations completed');
    }

    // Start server
    const server = app.listen(appConfig.port, () => {
      console.log(`🚀 Server running on port ${appConfig.port}`);
      console.log(`📚 API Documentation: http://localhost:${appConfig.port}/api/public/welcome`);
      console.log(`🏥 Health Check: http://localhost:${appConfig.port}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        AppDataSource.destroy();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        AppDataSource.destroy();
        process.exit(0);
      });
    });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Failed to start server:', error);
    } else {
      console.error('❌ Failed to start server');
    }
    process.exit(1);
  }
}

startServer();
