import { Router } from 'express';
import authRouter from './auth.router';
import userRouter from './user.router';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userController = new UserController();

// Mount auth routes
router.use('/auth', authRouter);

// Mount user routes
router.use('/user', userRouter);

// GET /api/users (protected) - Lista de usuarios
router.get(
  '/users',
  authMiddleware,
  userController.getUsers.bind(userController)
);

export default router;

