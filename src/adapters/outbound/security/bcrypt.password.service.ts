import bcrypt from 'bcrypt';
import { IPasswordService } from '../../../domain/ports/outbound/password.service.port';

export class BcryptPasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}