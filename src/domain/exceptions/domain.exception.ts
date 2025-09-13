export class DomainException extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class UserNotFoundException extends DomainException {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`, 'USER_NOT_FOUND');
  }
}

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 'USER_ALREADY_EXISTS');
  }
}

export class InvalidCredentialsException extends DomainException {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class UserDeactivatedException extends DomainException {
  constructor() {
    super('User account is deactivated', 'USER_DEACTIVATED');
  }
}

export class InsufficientPermissionsException extends DomainException {
  constructor(action: string) {
    super(`Insufficient permissions to ${action}`, 'INSUFFICIENT_PERMISSIONS');
  }
}

export class RoleNotFoundException extends DomainException {
  constructor(roleName: string) {
    super(`Role ${roleName} not found`, 'ROLE_NOT_FOUND');
  }
}
