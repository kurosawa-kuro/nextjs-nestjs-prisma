// src/todos/todo.model.spec.ts

// External libraries
import { validate } from 'class-validator';

// Internal modules
import { CreateTodo, UpdateTodo } from '@/models/todo.model';

describe('Todo Model', () => {
  describe('CreateTodo', () => {
    it('should pass validation with valid data', async () => {
      const todo = new CreateTodo();
      todo.userId = 1;
      todo.title = 'Test Todo';

      const errors = await validate(todo);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid userId', async () => {
      const todo = new CreateTodo();
      todo.userId = 'invalid' as any; // TypeScriptの型チェックを回避するためにanyを使用
      todo.title = 'Test Todo';

      const errors = await validate(todo);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userId');
    });

    it('should fail validation with invalid title', async () => {
      const todo = new CreateTodo();
      todo.userId = 1;
      todo.title = 123 as any; // TypeScriptの型チェックを回避するためにanyを使用

      const errors = await validate(todo);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });
  });

  describe('UpdateTodo', () => {
    it('should pass validation with valid partial data', async () => {
      const todo = new UpdateTodo();
      todo.title = 'Updated Todo';

      const errors = await validate(todo);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with empty object', async () => {
      const todo = new UpdateTodo();

      const errors = await validate(todo);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with invalid userId', async () => {
      const todo = new UpdateTodo();
      todo.userId = 'invalid' as any;

      const errors = await validate(todo);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('userId');
    });

    it('should fail validation with invalid title', async () => {
      const todo = new UpdateTodo();
      todo.title = 123 as any;

      const errors = await validate(todo);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('title');
    });
  });
});
