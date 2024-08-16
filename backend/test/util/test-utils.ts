// test\test-utils.ts

// External libraries
import { Test, TestingModule } from '@nestjs/testing';

// Internal modules
import { PrismaClientService } from '@/orm/prisma-client.service';

type MockPrismaModel = {
  findMany: jest.Mock;
  count: jest.Mock;
  findUnique: jest.Mock;
  findFirst: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

type MockPrismaClientService = {
  [key: string]: MockPrismaModel;
} & jest.Mocked<PrismaClientService>;

export const setupTestModule = async <T>(
  ServiceClass: new (...args: any[]) => T,
  modelName: string,
): Promise<{
  service: T;
  prismaClientService: MockPrismaClientService;
}> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ServiceClass,
      {
        provide: PrismaClientService,
        useValue: {
          [modelName]: {
            findMany: jest.fn(),
            count: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      },
    ],
  }).compile();

  const service = module.get<T>(ServiceClass);
  const prismaClientService = module.get<PrismaClientService>(
    PrismaClientService,
  ) as MockPrismaClientService;

  return { service, prismaClientService };
};
