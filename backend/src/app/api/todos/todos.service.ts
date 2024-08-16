import { Injectable } from '@nestjs/common';
import { PrismaBaseService } from '@/lib/prisma-base.service';
import { PrismaClientService } from '@/orm/prisma-client.service';
import { Todo } from '@prisma/client';

@Injectable()
export class TodosService extends PrismaBaseService<Todo> {
  constructor(prisma: PrismaClientService) {
    super(prisma, 'todo');
  }
}
