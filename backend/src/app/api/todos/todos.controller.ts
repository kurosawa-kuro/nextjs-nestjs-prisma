import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { TodosService } from '@/app/api/todos/todos.service';
import { CreateTodo, UpdateTodo } from '@/models/todo.model';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiBody({ type: CreateTodo })
  @ApiResponse({
    status: 201,
    description: 'Todo successfully created.',
    type: CreateTodo,
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async create(@Body() createTodo: CreateTodo) {
    try {
      return await this.todosService.create(createTodo);
    } catch (error) {
      throw new BadRequestException('Failed to create todo');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiResponse({
    status: 200,
    description: 'Return all todos.',
    type: [CreateTodo],
  })
  async index() {
    return await this.todosService.all();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Todo ID' })
  @ApiResponse({
    status: 200,
    description: 'Todo successfully retrieved.',
    type: CreateTodo,
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  async show(@Param('id', ParseIntPipe) id: number) {
    const todo = await this.todosService.find(id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a todo by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Todo ID' })
  @ApiBody({ type: UpdateTodo })
  @ApiResponse({
    status: 200,
    description: 'Todo successfully updated.',
    type: CreateTodo,
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodo: UpdateTodo,
  ) {
    const todo = await this.todosService.update(id, updateTodo);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Todo ID' })
  @ApiResponse({ status: 200, description: 'Todo successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  async destroy(@Param('id', ParseIntPipe) id: number) {
    const todo = await this.todosService.destroy(id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return { message: 'Todo successfully deleted' };
  }
}
