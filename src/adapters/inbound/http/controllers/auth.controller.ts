import { Request, Response } from 'express';
import { AuthDependencies } from '../../dependencies';
import { SignupRequestDto } from '../../../../application/dto/signup.request.dto';
import { LoginRequestDto } from '../../../../application/dto/login.request.dto';
import { AuthResponseDto } from '../../../../application/dto/auth.response.dto';
import { UserResponseDto } from '../../../../application/dto/user.response.dto';
import { UserMapper } from '../../../../application/mappers/user.mapper';

export class AuthController {
  private authService = AuthDependencies.getAuthService();

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const signupData: SignupRequestDto = req.body;
      const user = await this.authService.signup(signupData);
      const userData = UserMapper.toUserData(user);
      
      res.status(201).json({
        message: 'User created successfully',
        user: new UserResponseDto(userData),
      });
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : 'Signup failed',
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginRequestDto = req.body;
      const authResponse = await this.authService.login(loginData);
      
      res.status(200).json(new AuthResponseDto(authResponse.token, authResponse.user));
    } catch (error) {
      res.status(401).json({
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  }
}