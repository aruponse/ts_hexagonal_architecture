import { describe, it, expect } from 'bun:test';
import { Password } from '../../src/modules/auth/domain/value_objects/password.value_object';

describe('Password Value Object', () => {
  it('should create a valid password', () => {
    const password = new Password('ValidPass123!');
    expect(password.getValue()).toBe('ValidPass123!');
  });

  it('should throw error for password too short', () => {
    expect(() => new Password('123')).toThrow('Password must be at least 8 characters long');
  });

  it('should throw error for password without lowercase', () => {
    expect(() => new Password('VALIDPASS123!')).toThrow('Password must contain at least one lowercase letter');
  });

  it('should throw error for password without uppercase', () => {
    expect(() => new Password('validpass123!')).toThrow('Password must contain at least one uppercase letter');
  });

  it('should throw error for password without number', () => {
    expect(() => new Password('ValidPassword!')).toThrow('Password must contain at least one number');
  });

  it('should throw error for password without special character', () => {
    expect(() => new Password('ValidPassword123')).toThrow('Password must contain at least one special character');
  });

  it('should compare passwords correctly', () => {
    const password1 = new Password('ValidPass123!');
    const password2 = new Password('ValidPass123!');
    const password3 = new Password('DifferentPass123!');

    expect(password1.equals(password2)).toBe(true);
    expect(password1.equals(password3)).toBe(false);
  });
});

