import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@/app/api/users/users.service';
import { PrismaClientService } from '@/orm/prisma-client.service';
import { User, Prisma } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaClientService: PrismaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaClientService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaClientService = module.get<PrismaClientService>(PrismaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData: Prisma.UserCreateInput = {
        email: 'newuser@example.com',
        name: 'New User',
        password: 'password123',
      };

      const createdUser: User = {
        id: 1,
        ...userData,
        avatar: null,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientService.user.create as jest.Mock).mockResolvedValue(
        createdUser,
      );

      const result = await service.register(userData);
      expect(result).toEqual(createdUser);
      expect(prismaClientService.user.create).toHaveBeenCalledWith({
        data: userData,
      });
    });
  });

  describe('index', () => {
    it('should return a list of users', async () => {
      const users: User[] = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User 1',
          avatar: null,
          password: 'password123',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          email: 'user2@example.com',
          name: 'User 2',
          avatar: null,
          password: 'password123',
          role: 'USER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prismaClientService.user.findMany as jest.Mock).mockResolvedValue(users);

      const params: Prisma.UserFindManyArgs = {
        where: { name: 'User' },
        orderBy: [{ name: 'asc' }],
      };

      const result = await service.index(params);
      expect(result).toEqual(users);
      expect(prismaClientService.user.findMany).toHaveBeenCalledWith(params);
    });
  });

  describe('updateAvatar', () => {
    it('should update user avatar', async () => {
      const userId = 1;
      const avatarUrl = 'http://example.com/avatar.jpg';

      const updatedUser: User = {
        id: userId,
        email: 'user@example.com',
        name: 'User',
        avatar: avatarUrl,
        password: 'password123',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientService.user.update as jest.Mock).mockResolvedValue(
        updatedUser,
      );

      const result = await service.updateAvatar(userId, avatarUrl);
      expect(result).toEqual(updatedUser);
      expect(prismaClientService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { avatar: avatarUrl },
      });
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'user@example.com';
      const user: User = {
        id: 1,
        email: email,
        name: 'User',
        avatar: null,
        password: 'password123',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaClientService.user.findFirst as jest.Mock).mockResolvedValue(user);

      const result = await service.findByEmail(email);
      expect(result).toEqual(user);
      expect(prismaClientService.user.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null if user not found', async () => {
      const email = 'nonexistent@example.com';

      (prismaClientService.user.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail(email);
      expect(result).toBeNull();
      expect(prismaClientService.user.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });
});
