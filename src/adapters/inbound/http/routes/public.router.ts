import { Router } from 'express';
import { WelcomeController } from '@/adapters/inbound/http/controllers/welcome.controller';

const router = Router();
const welcomeController = new WelcomeController();

// GET /api/public/welcome
router.get('/welcome', welcomeController.welcome.bind(welcomeController));

export default router;