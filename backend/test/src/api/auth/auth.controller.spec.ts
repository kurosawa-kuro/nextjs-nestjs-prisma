import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/app/api/auth/auth.controller';
import { AuthService } from '@/app/api/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { CreateUser } from '@/models/auth.model';
import { AuthGuard } from '@/guards/auth.guard';
import { BadRequestException } from '@nestjs/common';

// Update MockAuthService interface
interface MockAuthService {
  create: jest.Mock;
  register: jest.Mock;
  login: jest.Mock;
  getCurrentUser: jest.Mock;
  logout: jest.Mock;
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: MockAuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            create: jest.fn(),
            register: jest.fn(),
            login: jest.fn(),
            getCurrentUser: jest.fn(),
            logout: jest.fn(),
          } as MockAuthService,
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: AuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should call AuthService.create with CreateUser', async () => {
      const dto = new CreateUser();
      dto.name = 'John Doe';
      dto.email = 'john@example.com';
      dto.password = 'password';
      dto.passwordConfirm = 'password';

      const expectedUser = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        avatar: null,
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      authService.create.mockResolvedValue(expectedUser);
      expect(await controller.register(dto)).toEqual(expectedUser);
      expect(authService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should set cookie and return user', async () => {
      const mockResponse = { cookie: jest.fn() } as unknown as Response;
      const loginResult = { user: { id: 1, name: 'John Doe' }, token: 'token' };

      authService.login.mockResolvedValue(loginResult);
      expect(
        await controller.login('email@example.com', 'password', mockResponse),
      ).toEqual(loginResult.user);
      expect(authService.login).toHaveBeenCalledWith(
        'email@example.com',
        'password',
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith('jwt', 'token', {
        httpOnly: true,
      });
    });

    it('should throw BadRequestException when login fails', async () => {
      const mockResponse = { cookie: jest.fn() } as unknown as Response;
      authService.login.mockRejectedValue(new Error('Login error'));

      await expect(
        controller.login('email@example.com', 'password', mockResponse),
      ).rejects.toThrow(BadRequestException);
      expect(authService.login).toHaveBeenCalledWith(
        'email@example.com',
        'password',
      );
    });
  });

  describe('user', () => {
    it('should call AuthService.getCurrentUser and return result', async () => {
      const req = {
        user: { id: 1 },
        headers: {},
        params: {},
        query: {},
      } as unknown as Request;
      const expectedUser = { id: 1, name: 'John Doe' };
      authService.getCurrentUser.mockResolvedValue(expectedUser);

      expect(await controller.user(req)).toEqual(expectedUser);
      expect(authService.getCurrentUser).toHaveBeenCalledWith(req);
    });
  });

  describe('logout', () => {
    it('should call AuthService.logout and return success message', async () => {
      const mockResponse = { clearCookie: jest.fn() } as unknown as Response;

      authService.logout.mockImplementation((response: Response) => {
        response.clearCookie('jwt');
      });

      const result = await controller.logout(mockResponse);

      expect(authService.logout).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual({ message: 'Success' });
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');
    });

    it('should throw BadRequestException when logout fails', async () => {
      const mockResponse = { clearCookie: jest.fn() } as unknown as Response;
      authService.logout.mockImplementation(() => {
        throw new Error('Logout error');
      });

      await expect(controller.logout(mockResponse)).rejects.toThrow(
        BadRequestException,
      );
      expect(authService.logout).toHaveBeenCalledWith(mockResponse);
    });
  });
});
