import { Injectable } from '@nestjs/common';
import { PrismaBaseService } from '@/lib/prisma-base.service';
import { PrismaClientService } from '@/orm/prisma-client.service';
import {
  CategoryTodoWithRelations,
  TodoWithCategories,
  CategoryWithTodos,
} from '@/models/categoryTodo.model';

@Injectable()
export class CategoryTodosService extends PrismaBaseService<CategoryTodoWithRelations> {
  constructor(prisma: PrismaClientService) {
    super(prisma, 'categoryTodo');
  }

  async addTodoToCategory(
    todoId: number,
    categoryId: number,
  ): Promise<CategoryTodoWithRelations> {
    return this.prisma.categoryTodo.create({
      data: {
        todoId,
        categoryId,
      },
      include: {
        todo: true,
        category: true,
      },
    });
  }

  async removeTodoFromCategory(
    todoId: number,
    categoryId: number,
  ): Promise<CategoryTodoWithRelations> {
    return this.prisma.categoryTodo.delete({
      where: {
        todoId_categoryId: {
          todoId,
          categoryId,
        },
      },
      include: {
        todo: true,
        category: true,
      },
    });
  }

  async getTodosForCategory(categoryId: number): Promise<CategoryWithTodos> {
    return this.prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        todos: {
          include: {
            todo: true,
          },
        },
      },
    }) as Promise<CategoryWithTodos>;
  }

  async getCategoriesForTodo(todoId: number): Promise<TodoWithCategories> {
    return this.prisma.todo.findUnique({
      where: { id: todoId },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    }) as Promise<TodoWithCategories>;
  }
}
