import { describe, it, expect } from 'bun:test';
import { AuthValidator } from '../../src/modules/auth/application/validators/auth.validator';

describe('Auth Validator', () => {
  describe('validateSignupRequest', () => {
    it('should validate correct signup request', () => {
      const validRequest = {
        email: 'test@example.com',
        password: 'ValidPass123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      expect(() => AuthValidator.validateSignupRequest(validRequest)).not.toThrow();
    });

    it('should throw error for invalid email', () => {
      const invalidRequest = {
        email: 'invalid-email',
        password: 'ValidPass123!',
        firstName: 'John',
        lastName: 'Doe',
      };

      expect(() => AuthValidator.validateSignupRequest(invalidRequest)).toThrow('Valid email is required');
    });

    it('should throw error for short password', () => {
      const invalidRequest = {
        email: 'test@example.com',
        password: '123',
        firstName: 'John',
        lastName: 'Doe',
      };

      expect(() => AuthValidator.validateSignupRequest(invalidRequest)).toThrow('Password must be at least 8 characters long');
    });

    it('should throw error for short first name', () => {
      const invalidRequest = {
        email: 'test@example.com',
        password: 'ValidPass123!',
        firstName: 'A',
        lastName: 'Doe',
      };

      expect(() => AuthValidator.validateSignupRequest(invalidRequest)).toThrow('First name must be at least 2 characters long');
    });

    it('should throw error for short last name', () => {
      const invalidRequest = {
        email: 'test@example.com',
        password: 'ValidPass123!',
        firstName: 'John',
        lastName: 'B',
      };

      expect(() => AuthValidator.validateSignupRequest(invalidRequest)).toThrow('Last name must be at least 2 characters long');
    });
  });

  describe('validateLoginRequest', () => {
    it('should validate correct login request', () => {
      const validRequest = {
        email: 'test@example.com',
        password: 'ValidPass123!',
      };

      expect(() => AuthValidator.validateLoginRequest(validRequest)).not.toThrow();
    });

    it('should throw error for invalid email', () => {
      const invalidRequest = {
        email: 'invalid-email',
        password: 'ValidPass123!',
      };

      expect(() => AuthValidator.validateLoginRequest(invalidRequest)).toThrow('Valid email is required');
    });

    it('should throw error for missing password', () => {
      const invalidRequest = {
        email: 'test@example.com',
        password: '',
      };

      expect(() => AuthValidator.validateLoginRequest(invalidRequest)).toThrow('Password is required');
    });
  });

  describe('validateUserId', () => {
    it('should validate correct user ID', () => {
      expect(() => AuthValidator.validateUserId('valid-user-id')).not.toThrow();
    });

    it('should throw error for empty user ID', () => {
      expect(() => AuthValidator.validateUserId('')).toThrow('User ID is required');
    });

    it('should throw error for null user ID', () => {
      expect(() => AuthValidator.validateUserId(null as any)).toThrow('User ID is required');
    });
  });
});

