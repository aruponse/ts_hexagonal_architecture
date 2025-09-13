import { Request, Response } from 'express';
import { WelcomeService } from '@/application/services/welcome.service';

export class WelcomeController {
  private welcomeService = new WelcomeService();

  /**
   * @swagger
   * /api/public/welcome:
   *   get:
   *     summary: Mensaje de bienvenida público
   *     tags: [Public]
   *     responses:
   *       200:
   *         description: Mensaje de bienvenida obtenido exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/WelcomeResponse'
   */
  async welcome(req: Request, res: Response): Promise<void> {
    const welcomeMessage = this.welcomeService.getWelcomeMessage();
    res.status(200).json(welcomeMessage);
  }
}