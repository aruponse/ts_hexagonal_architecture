import { describe, it, expect, beforeEach } from 'bun:test';
import { JwtTokenService } from '@/adapters/outbound/security/jwt.token.service';

describe('JwtTokenService Integration', () => {
  let tokenService: JwtTokenService;

  beforeEach(() => {
    // Set test environment variables
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.JWT_EXPIRES_IN = '1h';
    tokenService = new JwtTokenService();
  });

  it('should generate token correctly', () => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      role: 'user',
    };

    const token = tokenService.generate(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
  });

  it('should verify token correctly', () => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      role: 'user',
    };

    const token = tokenService.generate(payload);
    const verifiedPayload = tokenService.verify(token);

    expect(verifiedPayload.userId).toBe(payload.userId);
    expect(verifiedPayload.email).toBe(payload.email);
    expect(verifiedPayload.role).toBe(payload.role);
    expect(verifiedPayload.iat).toBeDefined();
    expect(verifiedPayload.exp).toBeDefined();
  });

  it('should decode token correctly', () => {
    const payload = {
      userId: 'user-123',
      email: 'test@example.com',
      role: 'user',
    };

    const token = tokenService.generate(payload);
    const decodedPayload = tokenService.decode(token);

    expect(decodedPayload.userId).toBe(payload.userId);
    expect(decodedPayload.email).toBe(payload.email);
    expect(decodedPayload.role).toBe(payload.role);
  });

  it('should throw error for invalid token', () => {
    const invalidToken = 'invalid.token.here';

    expect(() => tokenService.verify(invalidToken)).toThrow('invalid token');
  });

  it('should return null for malformed token', () => {
    const malformedToken = 'not-a-jwt-token';

    const result = tokenService.decode(malformedToken);
    expect(result).toBeNull();
  });
});
