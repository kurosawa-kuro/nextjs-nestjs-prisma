import { IsNumber } from 'class-validator';
import { CategoryTodo } from '@prisma/client';
import { Todo } from '@/models/todo.model';
import { Category } from '@/models/category.model';

export class CreateCategoryTodo {
  @IsNumber()
  todoId: number;

  @IsNumber()
  categoryId: number;
}

export type CategoryTodoWithRelations = CategoryTodo & {
  todo?: Todo;
  category?: Category;
};

export type TodoWithCategories = Todo & {
  categories: CategoryTodoWithRelations[];
};

export type CategoryWithTodos = Category & {
  todos: CategoryTodoWithRelations[];
};
