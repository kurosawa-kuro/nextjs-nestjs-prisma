import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@/guards/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true if the token is verified successfully', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer validToken' },
          }),
        }),
      } as ExecutionContext;

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue({ userId: 1 });
      expect(await guard.canActivate(context)).toBe(true);
    });

    it('should throw an UnauthorizedException if the token is invalid', async () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer invalidToken' },
          }),
        }),
      } as ExecutionContext;

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
