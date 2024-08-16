import { Test, TestingModule } from '@nestjs/testing';
import { CategoryTodosController } from '@/app/api/category-todos/category-todos.controller';
import { CategoryTodosService } from '@/app/api/category-todos/category-todos.service';
import {
  CreateCategoryTodo,
  CategoryTodoWithRelations,
  TodoWithCategories,
  CategoryWithTodos,
} from '@/models/categoryTodo.model';

describe('CategoryTodoController', () => {
  let controller: CategoryTodosController;
  let service: CategoryTodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryTodosController],
      providers: [
        {
          provide: CategoryTodosService,
          useValue: {
            addTodoToCategory: jest.fn(),
            removeTodoFromCategory: jest.fn(),
            getTodosForCategory: jest.fn(),
            getCategoriesForTodo: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoryTodosController>(CategoryTodosController);
    service = module.get<CategoryTodosService>(CategoryTodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addTodoToCategory', () => {
    it('should call addTodoToCategory service method', async () => {
      const createCategoryTodo: CreateCategoryTodo = {
        todoId: 1,
        categoryId: 1,
      };
      const expectedResult: CategoryTodoWithRelations = {
        todoId: 1,
        categoryId: 1,
      };

      jest
        .spyOn(service, 'addTodoToCategory')
        .mockResolvedValue(expectedResult);

      const result = await controller.addTodoToCategory(createCategoryTodo);

      expect(service.addTodoToCategory).toHaveBeenCalledWith(
        createCategoryTodo.todoId,
        createCategoryTodo.categoryId,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('removeTodoFromCategory', () => {
    it('should call removeTodoFromCategory service method', async () => {
      const todoId = '1';
      const categoryId = '1';
      const expectedResult: CategoryTodoWithRelations = {
        todoId: 1,
        categoryId: 1,
      };

      jest
        .spyOn(service, 'removeTodoFromCategory')
        .mockResolvedValue(expectedResult);

      const result = await controller.removeTodoFromCategory(
        todoId,
        categoryId,
      );

      expect(service.removeTodoFromCategory).toHaveBeenCalledWith(
        +todoId,
        +categoryId,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getTodosForCategory', () => {
    it('should call getTodosForCategory service method', async () => {
      const categoryId = '1';
      const expectedResult: CategoryWithTodos = {
        id: 1,
        title: 'Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        todos: [],
      };

      jest
        .spyOn(service, 'getTodosForCategory')
        .mockResolvedValue(expectedResult);

      const result = await controller.getTodosForCategory(categoryId);

      expect(service.getTodosForCategory).toHaveBeenCalledWith(+categoryId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getCategoriesForTodo', () => {
    it('should call getCategoriesForTodo service method', async () => {
      const todoId = '1';
      const expectedResult: TodoWithCategories = {
        id: 1,
        title: 'Todo',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [],
      };

      jest
        .spyOn(service, 'getCategoriesForTodo')
        .mockResolvedValue(expectedResult);

      const result = await controller.getCategoriesForTodo(todoId);

      expect(service.getCategoriesForTodo).toHaveBeenCalledWith(+todoId);
      expect(result).toEqual(expectedResult);
    });
  });
});
