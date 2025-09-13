import { Router } from 'express';
import authRouter from './auth.router';
import userRouter from './user.router';

const router = Router();

// Mount auth routes
router.use('/auth', authRouter);

// Mount user routes
router.use('/users', userRouter);

export default router;

