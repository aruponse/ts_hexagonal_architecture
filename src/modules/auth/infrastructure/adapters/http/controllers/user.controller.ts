import { Response } from 'express';
import { AuthDependencies } from '../../../dependencies';
import { PublicUserResponseDto } from '../dto/user.response.dto';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { UserMapper } from '../../../../application/mappers/user.mapper';

export class UserController {
  private authService = AuthDependencies.getAuthService();

  async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const users = await this.authService.getUsers(req.user.userId);
      const usersData = users.map(user => 
        new PublicUserResponseDto(UserMapper.toPublicUserData(user))
      );
      
      res.status(200).json({
        users: usersData,
        count: usersData.length,
      });
    } catch (error) {
      res.status(403).json({
        error: error instanceof Error ? error.message : 'Access denied',
      });
    }
  }
}
