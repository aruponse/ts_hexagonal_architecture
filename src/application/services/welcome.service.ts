export interface WelcomeMessage {
  message: string;
  version: string;
  timestamp: string;
  endpoints: {
    public: string[];
    auth: string[];
    users: string[];
  };
}

export class WelcomeService {
  getWelcomeMessage(): WelcomeMessage {
    return {
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
    };
  }
}