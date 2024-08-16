import { Test, TestingModule } from '@nestjs/testing';
import { TodosController } from '@/app/api/todos/todos.controller';
import { TodosService } from '@/app/api/todos/todos.service';
import { CreateTodo, UpdateTodo } from '@/models/todo.model';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('TodosController', () => {
  let controller: TodosController;
  let service: TodosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            create: jest.fn(),
            all: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo', async () => {
      const createTodo: CreateTodo = { title: 'New Todo', userId: 1 };
      const expectedResult = {
        id: 1,
        ...createTodo,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult);

      expect(await controller.create(createTodo)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createTodo);
    });

    it('should throw BadRequestException if creation fails', async () => {
      const createTodo: CreateTodo = { title: 'New Todo', userId: 1 };

      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(controller.create(createTodo)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.create).toHaveBeenCalledWith(createTodo);
    });
  });

  describe('index', () => {
    it('should return an array of todos', async () => {
      const expectedResult = [
        {
          id: 1,
          title: 'Todo 1',
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      jest.spyOn(service, 'all').mockResolvedValue(expectedResult);

      expect(await controller.index()).toBe(expectedResult);
    });
  });

  describe('show', () => {
    it('should return a todo', async () => {
      const expectedResult = {
        id: 1,
        title: 'Todo 1',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'find').mockResolvedValue(expectedResult);

      expect(await controller.show(1)).toBe(expectedResult);
      expect(service.find).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if todo is not found', async () => {
      jest.spyOn(service, 'find').mockResolvedValue(null);

      await expect(controller.show(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodo: UpdateTodo = { title: 'Updated Todo' };
      const expectedResult = {
        id: 1,
        title: 'Updated Todo',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, 'update').mockResolvedValue(expectedResult);

      expect(await controller.update(1, updateTodo)).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(1, updateTodo);
    });

    it('should throw NotFoundException if todo is not found', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(null);

      await expect(controller.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('destroy', () => {
    it('should destroy a todo', async () => {
      const deletedTodo = {
        id: 1,
        title: 'Todo 1',
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const expectedResult = { message: 'Todo successfully deleted' };

      jest.spyOn(service, 'destroy').mockResolvedValue(deletedTodo);

      expect(await controller.destroy(1)).toEqual(expectedResult);
      expect(service.destroy).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if todo is not found', async () => {
      jest.spyOn(service, 'destroy').mockResolvedValue(null);

      await expect(controller.destroy(1)).rejects.toThrow(NotFoundException);
    });
  });
});
