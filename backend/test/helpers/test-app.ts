import { ValidationPipe, VersioningType, type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MeasurementUnit, type Worker, type WorkType } from '@prisma/client';

import { AppModule } from '@/app.module';
import { passwordHasher } from '@/modules/auth/application/password-hasher';
import { HttpExceptionFilter } from '@/shared/http/http-exception.filter';
import { PrismaService } from '@/shared/prisma/prisma.service';

export interface TestContext {
  app: INestApplication;
  prisma: PrismaService;
  cleanup: () => Promise<void>;
}

export async function createTestApp(): Promise<TestContext> {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication({ logger: false });
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.init();

  const prisma = app.get(PrismaService);
  await resetDatabase(prisma);

  return {
    app,
    prisma,
    cleanup: async () => {
      await app.close();
    },
  };
}

async function resetDatabase(prisma: PrismaService): Promise<void> {
  await prisma.workLog.deleteMany();
  await prisma.workType.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.user.deleteMany();
}

export interface SeededFixtures {
  adminPassword: string;
  admin: { id: string; login: string };
  workType: WorkType;
  worker: Worker;
}

export async function seedFixtures(prisma: PrismaService): Promise<SeededFixtures> {
  const adminPassword = 'admin123';
  const passwordHash = await passwordHasher.hash(adminPassword);
  const admin = await prisma.user.create({
    data: {
      login: 'admin',
      passwordHash,
      fullName: 'Иванов Иван Иванович',
      role: 'ADMIN',
    },
  });
  const workType = await prisma.workType.create({
    data: { name: 'Кладка перегородок', unit: MeasurementUnit.CUBIC_METER },
  });
  const worker = await prisma.worker.create({
    data: { fullName: 'Сидоров Алексей Викторович', brigade: 'Бригада №1' },
  });

  return { adminPassword, admin: { id: admin.id, login: admin.login }, workType, worker };
}
