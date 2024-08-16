import { Injectable } from '@nestjs/common';
import { PrismaBaseService } from '@/lib/prisma-base.service';
import { PrismaClientService } from '@/orm/prisma-client.service';
import { User, Prisma } from '@prisma/client';
import { UserWithoutPassword } from '@/types';

@Injectable()
export class UsersService extends PrismaBaseService<User> {
  constructor(prisma: PrismaClientService) {
    super(prisma, 'user');
  }

  async register(data: Prisma.UserCreateInput): Promise<UserWithoutPassword> {
    return this.create(data);
  }

  async index(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?:
      | Prisma.UserOrderByWithRelationInput
      | Prisma.UserOrderByWithRelationInput[]; // 修正点
  }): Promise<UserWithoutPassword[]> {
    return this.all(params);
  }

  async updateAvatar(
    id: number,
    avatarUrl: string,
  ): Promise<UserWithoutPassword> {
    return this.update(id, { avatar: avatarUrl });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findBy({ email });
  }
}
