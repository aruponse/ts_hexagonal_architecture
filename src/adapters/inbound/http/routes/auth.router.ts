import { Router } from 'express';
import { AuthController } from '@/adapters/inbound/http/controllers/auth.controller';
import { validationMiddleware } from '@/adapters/inbound/http/middlewares/validation.middleware';
import { SignupRequestDto } from '@/application/dto/signup.request.dto';
import { LoginRequestDto } from '@/application/dto/login.request.dto';

const router = Router();
const authController = new AuthController();

// POST /api/auth/signup
router.post(
  '/signup',
  validationMiddleware(SignupRequestDto),
  authController.signup.bind(authController)
);

// POST /api/auth/login
router.post(
  '/login',
  validationMiddleware(LoginRequestDto),
  authController.login.bind(authController)
);

export default router;