// src/category-todo/category-todo.module.ts
import { Module } from '@nestjs/common';
import { CategoryTodosController } from '@/app/api/category-todos/category-todos.controller';
import { CategoryTodosService } from '@/app/api/category-todos/category-todos.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

@Module({
  controllers: [CategoryTodosController],
  providers: [CategoryTodosService, PrismaClientService],
  exports: [CategoryTodosService],
})
export class CategoryTodoModule {}
