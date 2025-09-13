import { Router } from 'express';
import { PublicController } from '../controllers/public.controller';

const router = Router();
const publicController = new PublicController();

// GET /api/public/welcome
router.get('/welcome', publicController.welcome.bind(publicController));

export default router;
