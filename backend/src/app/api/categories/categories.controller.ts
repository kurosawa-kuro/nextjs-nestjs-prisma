import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CategoriesService } from '@/app/api/categories/categories.service';
import { Category } from '@prisma/client';
import {
  CreateCategory,
  UpdateCategory,
  CategoryWithTodos,
} from '@/models/category.model';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @Post()
  async create(@Body() data: CreateCategory): Promise<Category> {
    try {
      const category = await this.categoryService.create(data);
      if (!category) {
        throw new BadRequestException('Failed to create category');
      }
      return category;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.all();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    const category = await this.categoryService.find(+id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateCategory,
  ): Promise<Category> {
    const category = await this.categoryService.update(+id, data);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Category> {
    const category = await this.categoryService.destroy(+id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @Get(':id/todos')
  async findCategoryWithTodos(
    @Param('id') id: string,
  ): Promise<CategoryWithTodos> {
    const categoryWithTodos =
      await this.categoryService.findCategoryWithTodos(+id);
    if (!categoryWithTodos) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return categoryWithTodos;
  }
}
