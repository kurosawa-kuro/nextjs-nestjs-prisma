import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TokenUtility } from '@/helpers/token.util';

describe('TokenUtility', () => {
  describe('extractTokenFromRequest', () => {
    it('should extract token from Authorization header', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer test-token',
        },
      } as Request;

      const token = TokenUtility.extractTokenFromRequest(mockRequest);
      expect(token).toBe('test-token');
    });

    it('should extract token from cookies', () => {
      const mockRequest = {
        headers: {},
        cookies: {
          jwt: 'test-cookie-token',
        },
      } as unknown as Request;

      const token = TokenUtility.extractTokenFromRequest(mockRequest);
      expect(token).toBe('test-cookie-token');
    });

    it('should throw UnauthorizedException when no token is found', () => {
      const mockRequest = {
        headers: {},
        cookies: {},
      } as unknown as Request;

      expect(() => {
        TokenUtility.extractTokenFromRequest(mockRequest);
      }).toThrow(UnauthorizedException);
    });

    it('should prioritize Authorization header over cookies', () => {
      const mockRequest = {
        headers: {
          authorization: 'Bearer header-token',
        },
        cookies: {
          jwt: 'cookie-token',
        },
      } as unknown as Request;

      const token = TokenUtility.extractTokenFromRequest(mockRequest);
      expect(token).toBe('header-token');
    });

    it('should throw UnauthorizedException when Authorization header is invalid', () => {
      const mockRequest = {
        headers: {
          authorization: 'Invalid header-token',
        },
      } as Request;

      expect(() => {
        TokenUtility.extractTokenFromRequest(mockRequest);
      }).toThrow(UnauthorizedException);
    });
  });
});
