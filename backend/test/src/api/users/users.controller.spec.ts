import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/app/api/users/users.controller';
import { UsersService } from '@/app/api/users/users.service';
import { FileUploadService } from '@/lib/file-upload.service';
import { User } from '@prisma/client';
import { CreateUser, UpdateUser } from '@/models/user.model';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let fileUploadService: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            all: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
            updateAvatar: jest.fn(),
          },
        },
        {
          provide: 'FileUploadService',
          useValue: {
            generateFilename: jest.fn(),
            validateFile: jest.fn(),
            saveFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    fileUploadService = module.get('FileUploadService');
  });

  it('should create a user', async () => {
    const createUser: CreateUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Password123!',
      avatar: '/path/to/avatar',
    };

    const expectedResult: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
      avatar: '/path/to/avatar',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

    const result = await controller.create(createUser);
    expect(result).toEqual(expectedResult);
    expect(service.create).toHaveBeenCalledWith(createUser);
  });

  it('should return all users', async () => {
    const expectedResult: User[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        avatar: '/path/to/avatar',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest.spyOn(service, 'all').mockResolvedValue(expectedResult);

    const result = await controller.index();
    expect(result).toEqual(expectedResult);
    expect(service.all).toHaveBeenCalled();
  });

  it('should return a single user', async () => {
    const expectedResult: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
      avatar: '/path/to/avatar',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'find').mockResolvedValue(expectedResult);

    const result = await controller.show(1);
    expect(result).toEqual(expectedResult);
    expect(service.find).toHaveBeenCalledWith(1);
  });

  it('should update a user', async () => {
    const updateUser: UpdateUser = {
      name: 'John Doe Updated',
      email: 'john.updated@example.com',
      password: 'UpdatedPassword123!',
    };

    const expectedResult: User = {
      id: 1,
      name: 'John Doe Updated',
      email: 'john.updated@example.com',
      password: 'updatedhashedpassword',
      avatar: '/updated/path/to/avatar',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

    const result = await controller.update(1, updateUser);
    expect(result).toEqual(expectedResult);
    expect(service.update).toHaveBeenCalledWith(1, updateUser);
  });

  it('should delete a user', async () => {
    const deletedUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword',
      avatar: '/path/to/avatar',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(service, 'destroy').mockResolvedValue(deletedUser);

    const result = await controller.destroy(1);
    expect(result).toEqual({ message: 'User successfully deleted' });
    expect(service.destroy).toHaveBeenCalledWith(1);
  });

  describe('uploadAvatar', () => {
    it('should upload an avatar for a user', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        mimetype: 'image/jpeg',
      } as Express.Multer.File;

      const expectedFilename = 'generated-filename.jpg';
      const expectedAvatarUrl = `/uploads/avatars/${expectedFilename}`;

      const expectedResult: User = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        avatar: expectedAvatarUrl,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (fileUploadService.validateFile as jest.Mock).mockReturnValue(true);
      (fileUploadService.generateFilename as jest.Mock).mockReturnValue(
        expectedFilename,
      );
      (fileUploadService.saveFile as jest.Mock).mockResolvedValue(undefined);
      (service.updateAvatar as jest.Mock).mockResolvedValue(expectedResult);

      const result = await controller.uploadAvatar(1, mockFile);

      expect(result).toEqual({ avatarUrl: expectedResult.avatar });
      expect(fileUploadService.validateFile).toHaveBeenCalledWith(mockFile);
      expect(fileUploadService.generateFilename).toHaveBeenCalledWith(mockFile);
      expect(fileUploadService.saveFile).toHaveBeenCalledWith(
        mockFile,
        expectedFilename,
      );
      expect(service.updateAvatar).toHaveBeenCalledWith(1, expectedAvatarUrl);
    });

    it('should throw BadRequestException when no file is provided', async () => {
      await expect(controller.uploadAvatar(1, undefined)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when file is not an image', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        originalname: 'test.txt',
        mimetype: 'text/plain',
      } as Express.Multer.File;

      (fileUploadService.validateFile as jest.Mock).mockReturnValue(false);

      await expect(controller.uploadAvatar(1, mockFile)).rejects.toThrow(
        BadRequestException,
      );
      expect(fileUploadService.validateFile).toHaveBeenCalledWith(mockFile);
    });
  });
});
