import { validate } from 'class-validator';
import {
  CreateCategoryTodo,
  CategoryTodoWithRelations,
  TodoWithCategories,
  CategoryWithTodos,
} from '@/models/categoryTodo.model';
import { Todo } from '@/models/todo.model';
import { Category } from '@/models/category.model';

describe('CategoryTodo Model', () => {
  describe('CreateCategoryTodo', () => {
    it('should pass validation with valid data', async () => {
      const categoryTodo = new CreateCategoryTodo();
      categoryTodo.todoId = 1;
      categoryTodo.categoryId = 1;

      const errors = await validate(categoryTodo);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid todoId', async () => {
      const categoryTodo = new CreateCategoryTodo();
      categoryTodo.todoId = 'invalid' as any;
      categoryTodo.categoryId = 1;

      const errors = await validate(categoryTodo);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('todoId');
    });

    it('should fail validation with invalid categoryId', async () => {
      const categoryTodo = new CreateCategoryTodo();
      categoryTodo.todoId = 1;
      categoryTodo.categoryId = 'invalid' as any;

      const errors = await validate(categoryTodo);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('categoryId');
    });
  });

  describe('CategoryTodoWithRelations', () => {
    it('should have the correct structure', () => {
      const categoryTodoWithRelations: CategoryTodoWithRelations = {
        todoId: 1,
        categoryId: 1,
        todo: {} as Todo,
        category: {} as Category,
      };

      expect(categoryTodoWithRelations).toHaveProperty('todoId');
      expect(categoryTodoWithRelations).toHaveProperty('categoryId');
      expect(categoryTodoWithRelations).toHaveProperty('todo');
      expect(categoryTodoWithRelations).toHaveProperty('category');
    });
  });

  describe('TodoWithCategories', () => {
    it('should have the correct structure', () => {
      const todoWithCategories: TodoWithCategories = {
        id: 1,
        title: 'Test Todo',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        categories: [
          {
            todoId: 1,
            categoryId: 1,
            todo: {} as Todo,
            category: {} as Category,
          },
        ],
      };

      expect(todoWithCategories).toHaveProperty('id');
      expect(todoWithCategories).toHaveProperty('title');
      expect(todoWithCategories).toHaveProperty('userId');
      expect(todoWithCategories).toHaveProperty('createdAt');
      expect(todoWithCategories).toHaveProperty('updatedAt');
      expect(todoWithCategories).toHaveProperty('categories');
      expect(Array.isArray(todoWithCategories.categories)).toBe(true);
    });
  });

  describe('CategoryWithTodos', () => {
    it('should have the correct structure', () => {
      const categoryWithTodos: CategoryWithTodos = {
        id: 1,
        title: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
        todos: [
          {
            todoId: 1,
            categoryId: 1,
            todo: {} as Todo,
            category: {} as Category,
          },
        ],
      };

      expect(categoryWithTodos).toHaveProperty('id');
      expect(categoryWithTodos).toHaveProperty('title');
      expect(categoryWithTodos).toHaveProperty('createdAt');
      expect(categoryWithTodos).toHaveProperty('updatedAt');
      expect(categoryWithTodos).toHaveProperty('todos');
      expect(Array.isArray(categoryWithTodos.todos)).toBe(true);
    });
  });
});
