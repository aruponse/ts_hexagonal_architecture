import { BcryptPasswordService } from '../adapters/services/bcrypt.password.service';
import { JwtTokenService } from '../adapters/services/jwt.token.service';
import { IPasswordService } from '../../domain/ports/services/ipassword.service';
import { ITokenService } from '../../domain/ports/services/itoken.service';

export class ServiceFactory {
  private static passwordService: IPasswordService;
  private static tokenService: ITokenService;

  static getPasswordService(): IPasswordService {
    if (!this.passwordService) {
      this.passwordService = new BcryptPasswordService();
    }
    return this.passwordService;
  }

  static getTokenService(): ITokenService {
    if (!this.tokenService) {
      this.tokenService = new JwtTokenService();
    }
    return this.tokenService;
  }
}

