import { rmSync } from 'fs';
import path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { AppModule } from './../src/app.module';

describe('SIORT API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DB_PATH = './siort-test.sqlite';
    process.env.PORT = '0';

    const dbPath = path.resolve(process.cwd(), process.env.DB_PATH);
    rmSync(dbPath, { force: true });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET) returns the API status', async () => {
    const response = await request(app.getHttpServer()).get('/').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'ok',
        service: 'SIORT API',
      }),
    );
  });

  it('/health (GET) returns the health status', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        status: 'ok',
      }),
    );
  });

  it('/participants (POST) creates a participant', async () => {
    const email = `participant-${Date.now()}@example.com`;

    const response = await request(app.getHttpServer())
      .post('/participants')
      .send({
        name: 'Maria Silva',
        email,
        phone: '11999998888',
        cpf: '12345678909',
        institution: 'USP',
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Maria Silva',
        email,
      }),
    );
  });

  it('/courses (GET) returns the seeded courses', async () => {
    const response = await request(app.getHttpServer()).get('/courses').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/enrollments (POST) toggles enrollment for a participant', async () => {
    const participantEmail = `enroll-${Date.now()}@example.com`;
    await request(app.getHttpServer())
      .post('/participants')
      .send({
        name: 'João Pereira',
        email: participantEmail,
        phone: '11888887777',
        cpf: '98765432100',
      })
      .expect(201);

    const coursesResponse = await request(app.getHttpServer())
      .get('/courses')
      .expect(200);
    const courseId = coursesResponse.body[0].id;

    const response = await request(app.getHttpServer())
      .post('/enrollments')
      .send({
        email: participantEmail,
        courseId,
      })
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        enrolled: true,
      }),
    );
  });
});
