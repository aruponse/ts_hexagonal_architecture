import jwt, { SignOptions } from 'jsonwebtoken';
import { ITokenService } from '@/domain/ports/outbound/token.service.port';

export class JwtTokenService implements ITokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    // Usar la variable de entorno para el secreto JWT
    this.secret = process.env.JWT_SECRET || '';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    
    if (!this.secret) {
      throw new Error('JWT_SECRET environment variable is required');
    }
  }

  generate(payload: any): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as any);
  }

  verify(token: string): any {
    return jwt.verify(token, this.secret);
  }

  decode(token: string): any {
    return jwt.decode(token);
  }
}