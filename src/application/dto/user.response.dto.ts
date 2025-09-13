export class UserResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = {
      id: user.role.id,
      name: user.role.name,
      description: user.role.description,
    };
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

export class PublicUserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  role: {
    id: string;
    name: string;
    description: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = {
      id: user.role.id,
      name: user.role.name,
      description: user.role.description,
    };
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}