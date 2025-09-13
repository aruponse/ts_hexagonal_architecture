import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// GET /api/user/profile (protected)
router.get(
  '/profile',
  authMiddleware,
  userController.getProfile.bind(userController)
);

export default router;