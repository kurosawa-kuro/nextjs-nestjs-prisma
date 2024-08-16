// src/main.ts

import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { LoggerMiddleware } from './middleware/logger.middleware';

import { AppModule } from './config/modules/app.module';
import { corsConfig } from './config/cors.config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // LoggerMiddlewareの適用
  app.use(new LoggerMiddleware().use.bind(new LoggerMiddleware()));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  setupSwagger(app);
  app.enableCors(corsConfig);
  app.use(cookieParser());
  
  const port = process.env.BACKEND_PORT || 8080;
  await app.listen(port);
  
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation is available at: http://localhost:${port}/api-docs`);
}

bootstrap();