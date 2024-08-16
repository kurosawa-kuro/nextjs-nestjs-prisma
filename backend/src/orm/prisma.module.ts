// src\prisma\prisma.module.ts

// External libraries
import { Module } from '@nestjs/common';

// Internal modules
import { PrismaClientService } from '@/orm/prisma-client.service';

@Module({
  providers: [PrismaClientService],
  exports: [PrismaClientService],
})
export class PrismaModule {}
