import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '@/app/api/categories/categories.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

describe('CategoryService', () => {
  let service: CategoriesService;
  let prismaClientService: PrismaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaClientService,
          useValue: {
            category: {
              findMany: jest.fn().mockResolvedValue([
                { id: 1, title: 'Work' },
                { id: 2, title: 'Personal' },
              ]),
              findUnique: jest.fn().mockResolvedValue({
                id: 1,
                title: 'Work',
              }),
              create: jest.fn().mockResolvedValue({
                id: 3,
                title: 'Shopping',
              }),
              update: jest.fn().mockResolvedValue({
                id: 1,
                title: 'Updated Work',
              }),
              delete: jest.fn().mockResolvedValue({
                id: 2,
                title: 'Personal',
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaClientService = module.get<PrismaClientService>(PrismaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('all', () => {
    it('should return an array of categories', async () => {
      const categories = await service.all();
      expect(categories).toEqual([
        { id: 1, title: 'Work' },
        { id: 2, title: 'Personal' },
      ]);
      expect(prismaClientService.category.findMany).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should return a single category', async () => {
      const category = await service.find(1);
      expect(category).toEqual({
        id: 1,
        title: 'Work',
      });
      expect(prismaClientService.category.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const newCategory = await service.create({ title: 'Shopping' });
      expect(newCategory).toEqual({
        id: 3,
        title: 'Shopping',
      });
      expect(prismaClientService.category.create).toHaveBeenCalledWith({
        data: { title: 'Shopping' },
      });
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      const updatedCategory = await service.update(1, {
        title: 'Updated Work',
      });
      expect(updatedCategory).toEqual({
        id: 1,
        title: 'Updated Work',
      });
      expect(prismaClientService.category.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Updated Work' },
      });
    });
  });

  describe('destroy', () => {
    it('should delete a category', async () => {
      const deletedCategory = await service.destroy(2);
      expect(deletedCategory).toEqual({
        id: 2,
        title: 'Personal',
      });
      expect(prismaClientService.category.delete).toHaveBeenCalledWith({
        where: { id: 2 },
      });
    });
  });

  describe('findCategoryWithTodos', () => {
    it('should return a category with its todos', async () => {
      const mockCategoryWithTodos = {
        id: 1,
        title: 'Work',
        todos: [
          { todoId: 1, todo: { id: 1, title: 'Complete project', userId: 1 } },
          {
            todoId: 2,
            todo: { id: 2, title: 'Prepare presentation', userId: 1 },
          },
        ],
      };

      prismaClientService.category.findUnique = jest
        .fn()
        .mockResolvedValue(mockCategoryWithTodos);

      const result = await service.findCategoryWithTodos(1);
      expect(result).toEqual(mockCategoryWithTodos);
      expect(prismaClientService.category.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          todos: {
            include: {
              todo: true,
            },
          },
        },
      });
    });
  });
});
