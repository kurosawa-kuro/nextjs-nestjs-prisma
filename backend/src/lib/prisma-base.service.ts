// src/lib/PrismaBaseService.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '@/orm/prisma-client.service';
import { BaseService } from '@/lib/base.service';

@Injectable()
export abstract class PrismaBaseService<T> implements BaseService<T> {
  constructor(
    protected readonly prisma: PrismaClientService,
    protected readonly modelName: string,
  ) {}

  protected get model() {
    return this.prisma[this.modelName] as any;
  }

  async create(attributes: any): Promise<T> {
    return this.model.create({ data: attributes });
  }

  async all(options?: any): Promise<T[]> {
    return this.model.findMany(options);
  }

  async find(id: number): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findBy(attributes: any): Promise<T | null> {
    return this.model.findFirst({ where: attributes });
  }

  async where(attributes: any): Promise<T[]> {
    return this.model.findMany({ where: attributes });
  }

  async update(id: number, attributes: any): Promise<T> {
    return this.model.update({
      where: { id },
      data: attributes,
    });
  }

  async destroy(id: number): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async count(options?: any): Promise<number> {
    return this.model.count(options);
  }

  async first(options?: any): Promise<T | null> {
    return this.model.findFirst(options);
  }

  async last(options?: any): Promise<T | null> {
    const [result] = await this.model.findMany({
      ...options,
      orderBy: { id: 'desc' },
      take: 1,
    });
    return result || null;
  }
}
