import { Module } from '@nestjs/common';
import { PrismaModule } from '@/orm/prisma.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from '@/config/modules/user.module';
import { AuthModule } from '@/config/modules/auth.module';
import { TodoModule } from '@/config/modules/todo.module';
import { CategoryModule } from '@/config/modules/category.module';
import { CategoryTodoModule } from '@/config/modules/category-todo.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    TodoModule,
    CategoryModule,
    CategoryTodoModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
})
export class AppModule {}
