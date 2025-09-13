import { Router } from 'express';
import authRouter from '@/adapters/inbound/http/routes/auth.router';
import userRouter from '@/adapters/inbound/http/routes/user.router';
import { UserController } from '@/adapters/inbound/http/controllers/user.controller';
import { authMiddleware } from '@/adapters/inbound/http/middlewares/auth.middleware';

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
