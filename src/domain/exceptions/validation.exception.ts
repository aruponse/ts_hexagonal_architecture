export class ValidationException extends Error {
  constructor(message: string, public readonly field?: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class InvalidEmailException extends ValidationException {
  constructor(email: string) {
    super(`Invalid email format: ${email}`, 'email');
  }
}

export class InvalidPasswordException extends ValidationException {
  constructor(reason: string) {
    super(`Invalid password: ${reason}`, 'password');
  }
}

export class RequiredFieldException extends ValidationException {
  constructor(fieldName: string) {
    super(`Field ${fieldName} is required`, fieldName);
  }
}

export class InvalidStringLengthException extends ValidationException {
  constructor(fieldName: string, minLength: number, maxLength: number) {
    super(`Field ${fieldName} must be between ${minLength} and ${maxLength} characters`, fieldName);
  }
}
