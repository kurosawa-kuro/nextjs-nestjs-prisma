import { Controller, Post, Delete, Body, Param, Get } from '@nestjs/common';
import { CategoryTodosService } from '@/app/api/category-todos/category-todos.service';
import {
  CreateCategoryTodo,
  CategoryTodoWithRelations,
  TodoWithCategories,
  CategoryWithTodos,
} from '@/models/categoryTodo.model';

@Controller('category-todo')
export class CategoryTodosController {
  constructor(private readonly categoryTodoService: CategoryTodosService) {}

  @Post()
  async addTodoToCategory(
    @Body() data: CreateCategoryTodo,
  ): Promise<CategoryTodoWithRelations> {
    return this.categoryTodoService.addTodoToCategory(
      data.todoId,
      data.categoryId,
    );
  }

  @Delete(':todoId/:categoryId')
  async removeTodoFromCategory(
    @Param('todoId') todoId: string,
    @Param('categoryId') categoryId: string,
  ): Promise<CategoryTodoWithRelations> {
    return this.categoryTodoService.removeTodoFromCategory(
      +todoId,
      +categoryId,
    );
  }

  @Get('category/:categoryId')
  async getTodosForCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<CategoryWithTodos> {
    return this.categoryTodoService.getTodosForCategory(+categoryId);
  }

  @Get('todo/:todoId')
  async getCategoriesForTodo(
    @Param('todoId') todoId: string,
  ): Promise<TodoWithCategories> {
    return this.categoryTodoService.getCategoriesForTodo(+todoId);
  }
}
