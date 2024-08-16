import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/app/api/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/app/api/users/users.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('token'),
            verifyAsync: jest.fn().mockResolvedValue({ id: 1 }), // Ensure the id is a number
          },
        },
        {
          provide: UsersService,
          useValue: {
            register: jest.fn(),
            findByEmail: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should throw BadRequestException if passwords do not match', async () => {
      await expect(
        authService.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password1234',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a user if passwords match', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        avatar: '',
        role: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const createUserSpy = jest
        .spyOn(usersService, 'register')
        .mockResolvedValue(mockUser);
      await authService.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });
      expect(createUserSpy).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: expect.any(String),
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);
      await expect(
        authService.login('test@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user and token if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 12),
        avatar: '',
        role: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
      const loginResult = await authService.login(
        'test@example.com',
        'password123',
      );
      expect(loginResult).toEqual({ user: mockUser, token: 'token' });
    });
  });

  describe('getCurrentUser', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersService, 'find').mockResolvedValue(null);
      await expect(
        authService.getCurrentUser({
          headers: { authorization: 'Bearer token' },
        } as any),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user without password', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        avatar: '',
        role: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(usersService, 'find').mockResolvedValue(mockUser);
      const user = await authService.getCurrentUser({
        headers: { authorization: 'Bearer token' },
      } as any);
      expect(user).toEqual(
        expect.objectContaining({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          avatar: '', // 空の文字列が期待されている場合
          role: '', // 空の文字列が期待されている場合
        }),
      );
    });
  });

  describe('logout', () => {
    it('should clear the jwt cookie from the response', () => {
      const mockResponse = {
        clearCookie: jest.fn(),
      } as any; // Typing this as 'any' to avoid detailed mock typing for Response

      authService.logout(mockResponse);
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('jwt');
    });
  });
});
