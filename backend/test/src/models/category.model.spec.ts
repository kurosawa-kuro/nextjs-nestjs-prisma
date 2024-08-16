import { validate } from 'class-validator';
import {
  CreateCategory,
  UpdateCategory,
  CategoryWithTodos,
  Category,
} from '@/models/category.model';

describe('Category Model', () => {
  describe('CreateCategory', () => {
    it('should pass validation with valid data', async () => {
      const category = new CreateCategory();
      category.title = 'Test Category';

      const errors = await validate(category);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with empty title', async () => {
      const category = new CreateCategory();
      category.title = '';

      const errors = await validate(category);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should fail validation with non-string title', async () => {
      const category = new CreateCategory();
      (category as any).title = 123;

      const errors = await validate(category);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });
  });

  describe('UpdateCategory', () => {
    it('should pass validation with valid partial data', async () => {
      const category = new UpdateCategory();
      category.title = 'Updated Category';

      const errors = await validate(category);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with empty object', async () => {
      const category = new UpdateCategory();

      const errors = await validate(category);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with non-string title', async () => {
      const category = new UpdateCategory();
      (category as any).title = 123;

      const errors = await validate(category);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });

    it('should inherit properties from CreateCategory', () => {
      const updateCategoryProps = Object.getOwnPropertyNames(
        UpdateCategory.prototype,
      );
      const createCategoryProps = Object.getOwnPropertyNames(
        CreateCategory.prototype,
      );
      expect(updateCategoryProps).toEqual(
        expect.arrayContaining(createCategoryProps),
      );
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

      expect(categoryWithTodos).toHaveProperty('id');
      expect(categoryWithTodos).toHaveProperty('title');
      expect(categoryWithTodos).toHaveProperty('createdAt');
      expect(categoryWithTodos).toHaveProperty('updatedAt');
      expect(categoryWithTodos).toHaveProperty('todos');
      expect(Array.isArray(categoryWithTodos.todos)).toBe(true);
      expect(categoryWithTodos.todos[0]).toHaveProperty('todoId');
      expect(categoryWithTodos.todos[0]).toHaveProperty('categoryId');
      expect(categoryWithTodos.todos[0]).toHaveProperty('todo');
    });
  });

  describe('Category type', () => {
    it('should be the same as PrismaCategory', () => {
      const category: Category = {
        id: 1,
        title: 'Test Category',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('title');
      expect(category).toHaveProperty('createdAt');
      expect(category).toHaveProperty('updatedAt');
    });
  });
});
