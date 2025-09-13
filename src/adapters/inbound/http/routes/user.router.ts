import { Router } from 'express';
import { UserController } from '@/adapters/inbound/http/controllers/user.controller';
import { authMiddleware } from '@/adapters/inbound/http/middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// GET /api/user/profile (protected)
router.get(
  '/profile',
  authMiddleware,
  userController.getProfile.bind(userController)
);

export default router;