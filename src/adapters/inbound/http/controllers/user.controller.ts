import { Response } from 'express';
import { AuthDependencies } from '@/adapters/inbound/dependencies';
import { PublicUserResponseDto } from '@/application/dto/user.response.dto';
import { AuthenticatedRequest } from '@/adapters/inbound/http/middlewares/auth.middleware';
import { UserMapper } from '@/application/mappers/user.mapper';

export class UserController {
  private userService = AuthDependencies.getUserService();

  /**
   * @swagger
   * /api/user/profile:
   *   get:
   *     summary: Obtener perfil del usuario autenticado
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Perfil del usuario obtenido exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: Perfil obtenido exitosamente
   *                 data:
   *                   $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Usuario no autenticado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Usuario no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Obtener lista de usuarios (solo administradores)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuarios obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UsersListResponse'
   *       401:
   *         description: Usuario no autenticado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Acceso denegado - se requieren permisos de administrador
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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