import { User } from '../../domain/entities/user.entity';
import { UserData } from '../../domain/types/user.type';

export class UserMapper {
  static toUserData(user: User): UserData {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
      },
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toPublicUserData(user: User): Omit<UserData, 'email'> {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: {
        id: user.role.id,
        name: user.role.name,
        description: user.role.description,
      },
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toAuthResponse(user: User, token: string) {
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
}

