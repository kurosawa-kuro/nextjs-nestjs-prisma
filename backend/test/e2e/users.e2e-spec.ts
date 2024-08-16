// test/users.e2e-spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { cleanDatabase } from '../util/prisma-cleanup';

// Internal modules
import { PrismaClientService } from '@/orm/prisma-client.service';
import { CreateUser } from '@/models/user.model';
import { AppModule } from '@/config/modules/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prismaClientService: PrismaClientService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prismaClientService = app.get<PrismaClientService>(PrismaClientService); // 修正
  });

  afterAll(async () => {
    await prismaClientService.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await cleanDatabase(prismaClientService);
  });

  it('/users (POST)', async () => {
    const createUser: CreateUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUser)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(createUser.name);
    expect(response.body.email).toBe(createUser.email);
    // expect(response.body).not.toHaveProperty('password');
  });

  it('/users (GET)', async () => {
    // Create a user first
    await prismaClientService.user.create({
      data: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password456',
      },
    });

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('email');
    // expect(response.body[0]).not.toHaveProperty('password');
  });
});
