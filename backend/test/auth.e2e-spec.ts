import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp, seedFixtures, type SeededFixtures } from './helpers/test-app';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let cleanup: () => Promise<void>;
  let fixtures: SeededFixtures;

  beforeAll(async () => {
    const context = await createTestApp();
    app = context.app;
    cleanup = context.cleanup;
    fixtures = await seedFixtures(context.prisma);
  });

  afterAll(async () => {
    await cleanup();
  });

  it('POST /api/v1/auth/login возвращает токен при корректных учётных данных', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ login: fixtures.admin.login, password: fixtures.adminPassword })
      .expect(200);

    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.user.login).toBe('admin');
    expect(response.body.user.role).toBe('ADMIN');
  });

  it('POST /api/v1/auth/login отдаёт 401 при неверном пароле', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ login: fixtures.admin.login, password: 'wrong-password' })
      .expect(401);
  });

  it('GET /api/v1/auth/me требует Bearer токен', async () => {
    await request(app.getHttpServer()).get('/api/v1/auth/me').expect(401);
  });

  it('GET /api/v1/auth/me возвращает текущего пользователя по валидному токену', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ login: fixtures.admin.login, password: fixtures.adminPassword });

    const response = await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${loginResponse.body.accessToken}`)
      .expect(200);

    expect(response.body.login).toBe('admin');
  });

  it('POST /api/v1/auth/register создаёт пользователя и выдаёт токен', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/register')
      .send({
        login: 'new-foreman',
        password: 'new-pass-123',
        fullName: 'Новый Прораб Тестович',
      })
      .expect(201);

    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.user.role).toBe('FOREMAN');
  });
});
