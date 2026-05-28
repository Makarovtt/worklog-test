import type { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { createTestApp, seedFixtures, type SeededFixtures } from './helpers/test-app';

describe('Work Logs (e2e)', () => {
  let app: INestApplication;
  let cleanup: () => Promise<void>;
  let fixtures: SeededFixtures;
  let accessToken: string;

  async function authenticate(): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ login: fixtures.admin.login, password: fixtures.adminPassword });
    return response.body.accessToken;
  }

  beforeAll(async () => {
    const context = await createTestApp();
    app = context.app;
    cleanup = context.cleanup;
    fixtures = await seedFixtures(context.prisma);
    accessToken = await authenticate();
  });

  afterAll(async () => {
    await cleanup();
  });

  it('GET /api/v1/work-logs возвращает пустой список и total = 0 в начале', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/work-logs')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.items).toHaveLength(0);
    expect(response.body.total).toBe(0);
  });

  it('POST /api/v1/work-logs создаёт запись и возвращает её с раскрытыми связями', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/work-logs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        performedAt: '2026-05-28',
        workTypeId: fixtures.workType.id,
        volume: 24.5,
        workerId: fixtures.worker.id,
      })
      .expect(201);

    expect(response.body.id).toEqual(expect.any(String));
    expect(response.body.workType.name).toBe(fixtures.workType.name);
    expect(response.body.worker.fullName).toBe(fixtures.worker.fullName);
    expect(response.body.volume).toBe('24.5');
  });

  it('POST /api/v1/work-logs/bulk создаёт несколько записей в одной транзакции', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/work-logs/bulk')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        entries: [
          {
            performedAt: '2026-05-27',
            workTypeId: fixtures.workType.id,
            volume: 10,
            workerId: fixtures.worker.id,
          },
          {
            performedAt: '2026-05-26',
            workTypeId: fixtures.workType.id,
            volume: 20,
            workerId: fixtures.worker.id,
          },
          {
            performedAt: '2026-05-25',
            workTypeId: fixtures.workType.id,
            volume: 30,
            workerId: fixtures.worker.id,
          },
        ],
      })
      .expect(201);

    expect(response.body).toHaveLength(3);
  });

  it('GET /api/v1/work-logs фильтрует по диапазону дат', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/work-logs')
      .query({ dateFrom: '2026-05-26', dateTo: '2026-05-27' })
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.total).toBe(2);
    for (const item of response.body.items) {
      expect(['2026-05-26', '2026-05-27']).toContain(item.performedAt);
    }
  });

  it('DELETE /api/v1/work-logs удаляет несколько записей (bulk soft delete)', async () => {
    const listResponse = await request(app.getHttpServer())
      .get('/api/v1/work-logs')
      .set('Authorization', `Bearer ${accessToken}`);
    const ids = listResponse.body.items.slice(0, 2).map((item: { id: string }) => item.id);

    const deleteResponse = await request(app.getHttpServer())
      .delete('/api/v1/work-logs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ids })
      .expect(200);

    expect(deleteResponse.body.deletedCount).toBe(2);

    const afterListResponse = await request(app.getHttpServer())
      .get('/api/v1/work-logs')
      .set('Authorization', `Bearer ${accessToken}`);
    const remainingIds = afterListResponse.body.items.map((item: { id: string }) => item.id);
    for (const deletedId of ids) {
      expect(remainingIds).not.toContain(deletedId);
    }
  });

  it('POST /api/v1/work-logs/restore возвращает ранее удалённые записи', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/v1/work-logs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        performedAt: '2026-05-20',
        workTypeId: fixtures.workType.id,
        volume: 7,
        workerId: fixtures.worker.id,
      });

    await request(app.getHttpServer())
      .delete('/api/v1/work-logs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ids: [created.body.id] })
      .expect(200);

    const restoreResponse = await request(app.getHttpServer())
      .post('/api/v1/work-logs/restore')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ ids: [created.body.id] })
      .expect(200);

    expect(restoreResponse.body.restoredCount).toBe(1);
  });

  it('POST /api/v1/work-logs валидирует обязательные поля', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/work-logs')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ performedAt: 'не-дата', workTypeId: 'bad', volume: -1, workerId: 'bad' })
      .expect(400);
  });
});
