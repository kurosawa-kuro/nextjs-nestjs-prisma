import { Test, TestingModule } from '@nestjs/testing';
import { PrismaBaseService } from '@/lib/prisma-base.service';
import { PrismaClientService } from '@/orm/prisma-client.service';
import { Inject } from '@nestjs/common';

const mockPrismaClientService = {
  modelName: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

class TestService extends PrismaBaseService<any> {
  constructor(
    prisma: PrismaClientService,
    @Inject('modelName') modelName: string,
  ) {
    super(prisma, modelName);
  }
}

describe('PrismaBaseService', () => {
  let service: TestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestService,
        {
          provide: PrismaClientService,
          useValue: mockPrismaClientService,
        },
        {
          provide: 'modelName',
          useValue: 'modelName',
        },
      ],
    }).compile();

    service = module.get<TestService>(TestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new record', async () => {
    const attributes = { name: 'test' };
    const createdRecord = { id: 1, name: 'test' };
    mockPrismaClientService.modelName.create.mockResolvedValue(createdRecord);

    const result = await service.create(attributes);

    expect(result).toEqual(createdRecord);
    expect(mockPrismaClientService.modelName.create).toHaveBeenCalledWith({
      data: attributes,
    });
  });

  it('should retrieve all records', async () => {
    const records = [
      { id: 1, name: 'test1' },
      { id: 2, name: 'test2' },
    ];
    mockPrismaClientService.modelName.findMany.mockResolvedValue(records);

    const result = await service.all();

    expect(result).toEqual(records);
    expect(mockPrismaClientService.modelName.findMany).toHaveBeenCalled();
  });

  it('should find a record by id', async () => {
    const record = { id: 1, name: 'test' };
    mockPrismaClientService.modelName.findUnique.mockResolvedValue(record);

    const result = await service.find(1);

    expect(result).toEqual(record);
    expect(mockPrismaClientService.modelName.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should find a record by attributes', async () => {
    const record = { id: 1, name: 'test' };
    mockPrismaClientService.modelName.findFirst.mockResolvedValue(record);

    const result = await service.findBy({ name: 'test' });

    expect(result).toEqual(record);
    expect(mockPrismaClientService.modelName.findFirst).toHaveBeenCalledWith({
      where: { name: 'test' },
    });
  });

  it('should find multiple records by attributes', async () => {
    const records = [
      { id: 1, name: 'test' },
      { id: 2, name: 'test' },
    ];
    mockPrismaClientService.modelName.findMany.mockResolvedValue(records);

    const result = await service.where({ name: 'test' });

    expect(result).toEqual(records);
    expect(mockPrismaClientService.modelName.findMany).toHaveBeenCalledWith({
      where: { name: 'test' },
    });
  });

  it('should update a record', async () => {
    const updatedRecord = { id: 1, name: 'updated' };
    mockPrismaClientService.modelName.update.mockResolvedValue(updatedRecord);

    const result = await service.update(1, { name: 'updated' });

    expect(result).toEqual(updatedRecord);
    expect(mockPrismaClientService.modelName.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'updated' },
    });
  });

  it('should destroy a record', async () => {
    const deletedRecord = { id: 1, name: 'deleted' };
    mockPrismaClientService.modelName.delete.mockResolvedValue(deletedRecord);

    const result = await service.destroy(1);

    expect(result).toEqual(deletedRecord);
    expect(mockPrismaClientService.modelName.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should count records', async () => {
    mockPrismaClientService.modelName.count.mockResolvedValue(5);

    const result = await service.count();

    expect(result).toBe(5);
    expect(mockPrismaClientService.modelName.count).toHaveBeenCalled();
  });

  it('should find the first record', async () => {
    const record = { id: 1, name: 'first' };
    mockPrismaClientService.modelName.findFirst.mockResolvedValue(record);

    const result = await service.first();

    expect(result).toEqual(record);
    expect(mockPrismaClientService.modelName.findFirst).toHaveBeenCalled();
  });

  it('should find the last record', async () => {
    const record = { id: 5, name: 'last' };
    mockPrismaClientService.modelName.findMany.mockResolvedValue([record]);

    const result = await service.last();

    expect(result).toEqual(record);
    expect(mockPrismaClientService.modelName.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'desc' },
      take: 1,
    });
  });

  it('should return null when finding last record in empty table', async () => {
    mockPrismaClientService.modelName.findMany.mockResolvedValue([]);

    const result = await service.last();

    expect(result).toBeNull();
  });
});
