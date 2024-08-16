import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '@/app/api/categories/categories.controller';
import { CategoriesService } from '@/app/api/categories/categories.service';
import {
  CreateCategory,
  UpdateCategory,
  CategoryWithTodos,
} from '@/models/category.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Category } from '@prisma/client';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            create: jest.fn(),
            all: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
            findCategoryWithTodos: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const createCategory: CreateCategory = { title: 'New Category' };
      const expectedResult: Category = {
        id: 1,
        title: 'New Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(createCategory)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createCategory);
    });

    it('should throw BadRequestException if creation fails', async () => {
      const createCategory: CreateCategory = { title: 'New Category' };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Database error'));

      await expect(controller.create(createCategory)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).toHaveBeenCalledWith(createCategory);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const expectedResult: Category[] = [
        {
          id: 1,
          title: 'Category 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(service, 'all').mockResolvedValue(expectedResult);

      expect(await controller.findAll()).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const expectedResult: Category = {
        id: 1,
        title: 'Category 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'find').mockResolvedValue(expectedResult);

      expect(await controller.findOne('1')).toBe(expectedResult);
      expect(service.find).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if category is not found', async () => {
      jest.spyOn(service, 'find').mockResolvedValue(null);

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const updateCategory: UpdateCategory = { title: 'Updated Category' };
      const expectedResult: Category = {
        id: 1,
        title: 'Updated Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update('1', updateCategory)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateCategory);
    });

    it('should throw NotFoundException if category is not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(null);

      await expect(controller.update('1', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      const deletedCategory: Category = {
        id: 1,
        title: 'Category 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'destroy').mockResolvedValue(deletedCategory);

      expect(await controller.remove('1')).toBe(deletedCategory);
      expect(service.destroy).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if category is not found', async () => {
      jest.spyOn(service, 'destroy').mockResolvedValue(null);

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findCategoryWithTodos', () => {
    it('should return a category with todos', async () => {
      const expectedResult: CategoryWithTodos = {
        id: 1,
        title: 'Category 1',
        createdAt: new Date(),
        updatedAt: new Date(),
        todos: [
          {
            todoId: 1,
            categoryId: 1,
            todo: {
              id: 1,
              title: 'Todo 1',
              userId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };

      jest
        .spyOn(service, 'findCategoryWithTodos')
        .mockResolvedValue(expectedResult);

      expect(await controller.findCategoryWithTodos('1')).toBe(expectedResult);
      expect(service.findCategoryWithTodos).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if category is not found', async () => {
      jest.spyOn(service, 'findCategoryWithTodos').mockResolvedValue(null);

      await expect(controller.findCategoryWithTodos('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
