import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// GET /api/users (protected)
router.get(
  '/',
  authMiddleware,
  userController.getUsers.bind(userController)
);

export default router;

