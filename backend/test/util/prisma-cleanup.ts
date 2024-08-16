import { PrismaClientService } from '@/orm/prisma-client.service';

export const cleanDatabase = async (
  prismaClientService: PrismaClientService,
) => {
  await prismaClientService.user.deleteMany({});
  await prismaClientService.todo.deleteMany({});
};
