import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validationMiddleware } from '../middlewares/validation.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { SignupRequestDto } from '../dto/signup.request.dto';
import { LoginRequestDto } from '../dto/login.request.dto';

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

// GET /api/auth/profile (protected)
router.get(
  '/profile',
  authMiddleware,
  authController.getProfile.bind(authController)
);

export default router;

