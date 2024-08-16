import { Test, TestingModule } from '@nestjs/testing';
import { BaseController } from '@/lib/base.controller';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BaseController', () => {
  let controller: BaseController<any>;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      create: jest.fn(),
      all: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BaseController,
          useFactory: () => new BaseController(mockService, 'TestModel'),
        },
      ],
    }).compile();

    controller = module.get<BaseController<any>>(BaseController);
  });

  describe('constructor', () => {
    it('should throw an error if modelName is not provided', () => {
      expect(() => new BaseController(mockService, '')).toThrow(
        'modelName must be provided',
      );
      expect(() => new BaseController(mockService, null)).toThrow(
        'modelName must be provided',
      );
      expect(() => new BaseController(mockService, undefined)).toThrow(
        'modelName must be provided',
      );
    });

    it('should create instance when valid modelName is provided', () => {
      expect(() => new BaseController(mockService, 'ValidModel')).not.toThrow();
    });
  });

  describe('create', () => {
    it('should create an entity', async () => {
      const createDto = { name: 'Test' };
      mockService.create.mockResolvedValue(createDto);

      const result = await controller.create(createDto);
      expect(result).toEqual(createDto);
      expect(mockService.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException if creation fails', async () => {
      const createDto = { name: 'Test' };
      mockService.create.mockResolvedValue(null);

      await expect(controller.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException with error message if service throws an error', async () => {
      const createDto = { name: 'Test' };
      const errorMessage = 'Database error';
      mockService.create.mockRejectedValue(new Error(errorMessage));

      await expect(controller.create(createDto)).rejects.toThrow(
        `Failed to create TestModel: ${errorMessage}`,
      );
    });
  });

  describe('index', () => {
    it('should return all entities', async () => {
      const entities = [{ id: 1 }, { id: 2 }];
      mockService.all.mockResolvedValue(entities);

      const result = await controller.index();
      expect(result).toEqual(entities);
      expect(mockService.all).toHaveBeenCalled();
    });
  });

  describe('show', () => {
    it('should return an entity by id', async () => {
      const entity = { id: 1 };
      mockService.find.mockResolvedValue(entity);

      const result = await controller.show(1);
      expect(result).toEqual(entity);
      expect(mockService.find).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockService.find.mockResolvedValue(null);

      await expect(controller.show(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an entity', async () => {
      const updateDto = { name: 'Updated' };
      const updatedEntity = { id: 1, ...updateDto };
      mockService.update.mockResolvedValue(updatedEntity);

      const result = await controller.update(1, updateDto);
      expect(result).toEqual(updatedEntity);
      expect(mockService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockService.update.mockResolvedValue(null);

      await expect(controller.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('destroy', () => {
    it('should destroy an entity', async () => {
      mockService.destroy.mockResolvedValue({ id: 1 });

      const result = await controller.destroy(1);
      expect(result).toEqual({ message: 'TestModel successfully deleted' });
      expect(mockService.destroy).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if entity not found', async () => {
      mockService.destroy.mockResolvedValue(null);

      await expect(controller.destroy(1)).rejects.toThrow(NotFoundException);
    });
  });
});
