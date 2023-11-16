import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { AppModule } from './../app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { execSync } from 'child_process';

describe('Users (e2e)', () => {
  jest.setTimeout(600000);

  let app: INestApplication;

  const user = {
    username: 'samy',
    email: 'samy@gmail.com',
    firstName: 'samy',
    lastName: 'ahmed',
    dateOfBirth: '1996-06-20',
    password: '123456',
    phoneNumber: '1231231231',
  };

  beforeAll(async () => {
    const pg = await new PostgreSqlContainer('postgres')
      .withExposedPorts(5432)
      .withDatabase('banking')
      .withUsername('user')
      .withPassword('example')
      .start();

    const port = pg.getMappedPort(5432);

    process.env.DATABASE_URL = `postgresql://user:example@localhost:${port}/banking`;
    const databaseUrl = process.env.DATABASE_URL;

    execSync(`export DATABASE_URL=${databaseUrl} && npx prisma migrate dev`, {
      stdio: 'inherit',
    });

    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(user)
      .expect(201);
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('username', user.username);
  });
});
