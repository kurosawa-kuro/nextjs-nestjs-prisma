import { Test, TestingModule } from '@nestjs/testing';
import { CategoryTodosService } from '@/app/api/category-todos/category-todos.service';
import { PrismaClientService } from '@/orm/prisma-client.service';
import {
  CategoryTodoWithRelations,
  TodoWithCategories,
  CategoryWithTodos,
} from '@/models/categoryTodo.model';

describe('CategoryTodoService', () => {
  let service: CategoryTodosService;
  let prismaClientService: PrismaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryTodosService,
        {
          provide: PrismaClientService,
          useValue: {
            categoryTodo: {
              create: jest.fn(),
              delete: jest.fn(),
            },
            category: {
              findUnique: jest.fn(),
            },
            todo: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoryTodosService>(CategoryTodosService);
    prismaClientService = module.get<PrismaClientService>(PrismaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addTodoToCategory', () => {
    it('should add a todo to a category', async () => {
      const mockResult: CategoryTodoWithRelations = {
        todoId: 1,
        categoryId: 1,
        todo: {
          id: 1,
          title: 'Test Todo',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        category: {
          id: 1,
          title: 'Test Category',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      (prismaClientService.categoryTodo.create as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const result = await service.addTodoToCategory(1, 1);
      expect(result).toEqual(mockResult);
      expect(prismaClientService.categoryTodo.create).toHaveBeenCalledWith({
        data: { todoId: 1, categoryId: 1 },
        include: { todo: true, category: true },
      });
    });
  });

  describe('removeTodoFromCategory', () => {
    it('should remove a todo from a category', async () => {
      const mockResult: CategoryTodoWithRelations = {
        todoId: 1,
        categoryId: 1,
        todo: {
          id: 1,
          title: 'Test Todo',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        category: {
          id: 1,
          title: 'Test Category',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      (prismaClientService.categoryTodo.delete as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const result = await service.removeTodoFromCategory(1, 1);
      expect(result).toEqual(mockResult);
      expect(prismaClientService.categoryTodo.delete).toHaveBeenCalledWith({
        where: {
          todoId_categoryId: {
            todoId: 1,
            categoryId: 1,
          },
        },
        include: { todo: true, category: true },
      });
    });
  });

  describe('getTodosForCategory', () => {
    it('should return todos for a category', async () => {
      const mockResult: CategoryWithTodos = {
        id: 1,
        title: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        todos: [
          {
            todoId: 1,
            categoryId: 1,
            todo: {
              id: 1,
              title: 'Test Todo',
              userId: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };
      (prismaClientService.category.findUnique as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const result = await service.getTodosForCategory(1);
      expect(result).toEqual(mockResult);
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

  describe('getCategoriesForTodo', () => {
    it('should return categories for a todo', async () => {
      const mockResult: TodoWithCategories = {
        id: 1,
        title: 'Test Todo',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [
          {
            todoId: 1,
            categoryId: 1,
            category: {
              id: 1,
              title: 'Test Category',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };
      (prismaClientService.todo.findUnique as jest.Mock).mockResolvedValue(
        mockResult,
      );

      const result = await service.getCategoriesForTodo(1);
      expect(result).toEqual(mockResult);
      expect(prismaClientService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });
    });
  });
});
