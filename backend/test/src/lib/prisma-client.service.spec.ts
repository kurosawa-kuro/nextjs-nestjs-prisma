import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientService } from '@/orm/prisma-client.service';

describe('PrismaClientService', () => {
  let service: PrismaClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaClientService],
    }).compile();

    service = module.get<PrismaClientService>(PrismaClientService);
  });

  it('should call $connect on onModuleInit', async () => {
    // PrismaClient の $connect メソッドをモックします
    const connectSpy = jest
      .spyOn(service, '$connect')
      .mockResolvedValue(undefined);

    // onModuleInit メソッドを呼び出します
    await service.onModuleInit();

    // $connect メソッドが呼び出されたかを確認します
    expect(connectSpy).toHaveBeenCalled();

    // モックをリセットします
    connectSpy.mockRestore();
  });

  it('should call $disconnect on onModuleDestroy', async () => {
    // PrismaClient の $disconnect メソッドをモックします
    const disconnectSpy = jest
      .spyOn(service, '$disconnect')
      .mockResolvedValue(undefined);

    // onModuleDestroy メソッドを呼び出します
    await service.onModuleDestroy();

    // $disconnect メソッドが呼び出されたかを確認します
    expect(disconnectSpy).toHaveBeenCalled();

    // モックをリセットします
    disconnectSpy.mockRestore();
  });
});
