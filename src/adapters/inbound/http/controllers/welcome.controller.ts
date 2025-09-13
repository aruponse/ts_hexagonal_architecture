import { Request, Response } from 'express';
import { WelcomeService } from '../../../../application/services/welcome.service';

export class WelcomeController {
  private welcomeService = new WelcomeService();

  async welcome(req: Request, res: Response): Promise<void> {
    const welcomeMessage = this.welcomeService.getWelcomeMessage();
    res.status(200).json(welcomeMessage);
  }
}