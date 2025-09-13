import { Role } from './role.entity';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly role: Role,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static create(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: Role
  ): User {
    const now = new Date();
    return new User(
      '', // ID será asignado por la base de datos
      email,
      password,
      firstName,
      lastName,
      role,
      true, // Por defecto activo
      now,
      now
    );
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isAdmin(): boolean {
    return this.role.isAdmin();
  }

  canAccessUsers(): boolean {
    return this.isAdmin();
  }

  updateProfile(firstName: string, lastName: string): User {
    return new User(
      this.id,
      this.email,
      this.password,
      firstName,
      lastName,
      this.role,
      this.isActive,
      this.createdAt,
      new Date()
    );
  }

  changePassword(newPassword: string): User {
    return new User(
      this.id,
      this.email,
      newPassword,
      this.firstName,
      this.lastName,
      this.role,
      this.isActive,
      this.createdAt,
      new Date()
    );
  }

  deactivate(): User {
    return new User(
      this.id,
      this.email,
      this.password,
      this.firstName,
      this.lastName,
      this.role,
      false,
      this.createdAt,
      new Date()
    );
  }
}
