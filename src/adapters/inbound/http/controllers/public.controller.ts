import { Request, Response } from 'express';

export class PublicController {
  async welcome(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      message: 'Welcome to the Hexagonal Architecture API!',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      endpoints: {
        public: ['GET /api/public/welcome'],
        auth: [
          'POST /api/auth/signup',
          'POST /api/auth/login',
        ],
        users: [
          'GET /api/user/profile (protected)',
          'GET /api/users (protected)',
        ],
      },
    });
  }
}

