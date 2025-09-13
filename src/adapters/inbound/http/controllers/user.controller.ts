import { Response } from 'express';
import { AuthDependencies } from '@/adapters/inbound/dependencies';
import { PublicUserResponseDto } from '@/application/dto/user.response.dto';
import { AuthenticatedRequest } from '@/adapters/inbound/http/middlewares/auth.middleware';
import { UserMapper } from '@/application/mappers/user.mapper';

export class UserController {
  private userService = AuthDependencies.getUserService();

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const user = await this.userService.getProfile(req.user.userId);
      const userData = new PublicUserResponseDto(UserMapper.toPublicUserData(user));
      
      res.status(200).json({
        user: userData,
      });
    } catch (error) {
      res.status(404).json({
        error: error instanceof Error ? error.message : 'User not found',
      });
    }
  }

  async getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const users = await this.userService.getUsers(req.user.userId);
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