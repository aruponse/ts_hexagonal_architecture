import { User } from '../../models/user';

// Puerto para casos de uso de usuario
export interface IUserPort {
  getProfile(userId: string): Promise<User>;
  getUsers(requestingUserId: string): Promise<User[]>;
  updateProfile(userId: string, firstName: string, lastName: string): Promise<User>;
}