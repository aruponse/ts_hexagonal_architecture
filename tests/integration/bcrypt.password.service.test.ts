import { describe, it, expect, beforeEach } from 'bun:test';
import { BcryptPasswordService } from '@/adapters/outbound/security/bcrypt.password.service';

describe('BcryptPasswordService Integration', () => {
  let passwordService: BcryptPasswordService;

  beforeEach(() => {
    passwordService = new BcryptPasswordService();
  });

  it('should hash password correctly', async () => {
    const password = 'TestPassword123!';
    const hashedPassword = await passwordService.hash(password);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
    expect(hashedPassword.length).toBeGreaterThan(0);
  });

  it('should compare password correctly', async () => {
    const password = 'TestPassword123!';
    const hashedPassword = await passwordService.hash(password);

    const isValid = await passwordService.compare(password, hashedPassword);
    const isInvalid = await passwordService.compare('WrongPassword', hashedPassword);

    expect(isValid).toBe(true);
    expect(isInvalid).toBe(false);
  });

  it('should generate different hashes for same password', async () => {
    const password = 'TestPassword123!';
    const hash1 = await passwordService.hash(password);
    const hash2 = await passwordService.hash(password);

    expect(hash1).not.toBe(hash2);
  });

  it('should verify both hashes work with original password', async () => {
    const password = 'TestPassword123!';
    const hash1 = await passwordService.hash(password);
    const hash2 = await passwordService.hash(password);

    const isValid1 = await passwordService.compare(password, hash1);
    const isValid2 = await passwordService.compare(password, hash2);

    expect(isValid1).toBe(true);
    expect(isValid2).toBe(true);
  });
});

