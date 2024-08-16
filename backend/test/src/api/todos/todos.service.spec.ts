import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from '@/app/api/todos/todos.service';
import { PrismaClientService } from '@/orm/prisma-client.service';

describe('TodosService', () => {
  let service: TodosService;
  let prismaClientService: PrismaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaClientService,
          useValue: {
            todo: {
              findMany: jest.fn().mockResolvedValue([
                { id: 1, title: 'Test Todo 1', isComplete: false },
                { id: 2, title: 'Test Todo 2', isComplete: true },
              ]),
              findUnique: jest.fn().mockResolvedValue({
                id: 1,
                title: 'Test Todo 1',
                isComplete: false,
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    prismaClientService = module.get<PrismaClientService>(PrismaClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('all', () => {
    it('should return an array of todos', async () => {
      const todos = await service.all();
      expect(todos).toEqual([
        { id: 1, title: 'Test Todo 1', isComplete: false },
        { id: 2, title: 'Test Todo 2', isComplete: true },
      ]);
      expect(prismaClientService.todo.findMany).toHaveBeenCalled();
    });
  });

  describe('find', () => {
    it('should return a single todo', async () => {
      const todo = await service.find(1);
      expect(todo).toEqual({
        id: 1,
        title: 'Test Todo 1',
        isComplete: false,
      });
      expect(prismaClientService.todo.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
});
