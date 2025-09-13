import { User } from './user';
import { AuthTokenPayload, AuthResponse } from '../ports/inbound/auth.port';

export class Auth {
  static validateCredentials(email: string, password: string): boolean {
    if (!email || !password) {
      return false;
    }
    
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // Validación básica de password
    if (password.length < 8) {
      return false;
    }
    
    return true;
  }

  static createAuthResponse(token: string, user: User): AuthResponse {
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role.name,
      },
    };
  }

  static extractTokenPayload(token: string): AuthTokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        iat: payload.iat,
        exp: payload.exp,
      };
    } catch (error) {
      return null;
    }
  }
}