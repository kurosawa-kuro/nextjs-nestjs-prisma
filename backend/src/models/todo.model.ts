import { IsString, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Todo as PrismaTodo } from '@prisma/client';
import { UserWithoutPassword } from '@/types';

export type Todo = PrismaTodo;

export class CreateTodo {
  @IsNumber()
  userId: number;

  @IsString()
  title: string;
}

export class UpdateTodo extends PartialType(CreateTodo) {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsString()
  title?: string;
}

export type TodoWithUser = Todo & {
  user?: UserWithoutPassword;
};
