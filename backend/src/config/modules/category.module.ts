// src/category/category.module.ts
import { Module } from '@nestjs/common';
import { CategoriesController } from '@/app/api/categories/categories.controller';
import { CategoriesService } from '@/app/api/categories/categories.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaClientService],
  exports: [CategoriesService],
})
export class CategoryModule {}
