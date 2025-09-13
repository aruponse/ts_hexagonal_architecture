import { SignupRequest, LoginRequest } from '../../domain/types/auth.type';

export class AuthValidator {
  static validateSignupRequest(request: SignupRequest): void {
    if (!request.email || !this.isValidEmail(request.email)) {
      throw new Error('Valid email is required');
    }

    if (!request.password || request.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!request.firstName || request.firstName.trim().length < 2) {
      throw new Error('First name must be at least 2 characters long');
    }

    if (!request.lastName || request.lastName.trim().length < 2) {
      throw new Error('Last name must be at least 2 characters long');
    }
  }

  static validateLoginRequest(request: LoginRequest): void {
    if (!request.email || !this.isValidEmail(request.email)) {
      throw new Error('Valid email is required');
    }

    if (!request.password) {
      throw new Error('Password is required');
    }
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUserId(userId: string): void {
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID is required');
    }
  }
}
