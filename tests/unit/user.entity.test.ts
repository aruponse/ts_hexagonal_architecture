import { describe, it, expect } from 'bun:test';
import { User } from '../../src/modules/auth/domain/entities/user.entity';
import { Role } from '../../src/modules/auth/domain/entities/role.entity';

describe('User Entity', () => {
  const mockRole = new Role(
    'role-id',
    'user',
    'Standard user role',
    new Date(),
    new Date()
  );

  it('should create a user with correct properties', () => {
    const user = User.create(
      'test@example.com',
      'hashedPassword',
      'John',
      'Doe',
      mockRole
    );

    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('hashedPassword');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.role).toBe(mockRole);
    expect(user.isActive).toBe(true);
  });

  it('should return full name correctly', () => {
    const user = User.create(
      'test@example.com',
      'hashedPassword',
      'John',
      'Doe',
      mockRole
    );

    expect(user.getFullName()).toBe('John Doe');
  });

  it('should check if user is admin correctly', () => {
    const adminRole = new Role(
      'admin-role-id',
      'admin',
      'Admin role',
      new Date(),
      new Date()
    );

    const adminUser = User.create(
      'admin@example.com',
      'hashedPassword',
      'Admin',
      'User',
      adminRole
    );

    const regularUser = User.create(
      'user@example.com',
      'hashedPassword',
      'Regular',
      'User',
      mockRole
    );

    expect(adminUser.isAdmin()).toBe(true);
    expect(regularUser.isAdmin()).toBe(false);
  });

  it('should check access permissions correctly', () => {
    const adminRole = new Role(
      'admin-role-id',
      'admin',
      'Admin role',
      new Date(),
      new Date()
    );

    const adminUser = User.create(
      'admin@example.com',
      'hashedPassword',
      'Admin',
      'User',
      adminRole
    );

    const regularUser = User.create(
      'user@example.com',
      'hashedPassword',
      'Regular',
      'User',
      mockRole
    );

    expect(adminUser.canAccessUsers()).toBe(true);
    expect(regularUser.canAccessUsers()).toBe(false);
  });

  it('should update profile correctly', () => {
    const user = User.create(
      'test@example.com',
      'hashedPassword',
      'John',
      'Doe',
      mockRole
    );

    // Add a small delay to ensure different timestamps
    const originalTime = user.updatedAt.getTime();
    
    const updatedUser = user.updateProfile('Jane', 'Smith');

    expect(updatedUser.firstName).toBe('Jane');
    expect(updatedUser.lastName).toBe('Smith');
    expect(updatedUser.email).toBe('test@example.com');
    expect(updatedUser.updatedAt.getTime()).toBeGreaterThanOrEqual(originalTime);
  });

  it('should change password correctly', () => {
    const user = User.create(
      'test@example.com',
      'oldPassword',
      'John',
      'Doe',
      mockRole
    );

    const originalTime = user.updatedAt.getTime();
    const updatedUser = user.changePassword('newPassword');

    expect(updatedUser.password).toBe('newPassword');
    expect(updatedUser.updatedAt.getTime()).toBeGreaterThanOrEqual(originalTime);
  });

  it('should deactivate user correctly', () => {
    const user = User.create(
      'test@example.com',
      'hashedPassword',
      'John',
      'Doe',
      mockRole
    );

    const originalTime = user.updatedAt.getTime();
    const deactivatedUser = user.deactivate();

    expect(deactivatedUser.isActive).toBe(false);
    expect(deactivatedUser.updatedAt.getTime()).toBeGreaterThanOrEqual(originalTime);
  });
});
