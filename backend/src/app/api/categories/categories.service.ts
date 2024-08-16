import { Injectable } from '@nestjs/common';
import { PrismaBaseService } from '@/lib/prisma-base.service';
import { PrismaClientService } from '@/orm/prisma-client.service';
import { Category } from '@prisma/client';
import { CategoryWithTodos } from '@/models/category.model';

@Injectable()
export class CategoriesService extends PrismaBaseService<Category> {
  constructor(prisma: PrismaClientService) {
    super(prisma, 'category');
  }

  async findCategoryWithTodos(id: number): Promise<CategoryWithTodos | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        todos: {
          include: {
            todo: true,
          },
        },
      },
    });
  }
}
